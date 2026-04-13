import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { faker } from '@faker-js/faker';
import {
  FakeProductTagsResponse,
  FakeProductResponse,
  FakeProductsListResponse,
} from './dto/response/fake-product.response';
import {
  CreateFakeProductInput,
  GetFakeProductsInput,
  UpdateFakeProductInput,
} from './dto/input/fake-product.input';
import { FakeProduct } from './interface/fake-product.interface';
import { S3_TEMP_FOLDER_NAME, S3Service } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Resolver(() => FakeProductResponse)
export class FakeApiResolver {
  private productsDb: FakeProduct[] = [];
  private seed = 1234;
  private dummyImagePath = 'public/dummy-products/';
  private tags = new Array(50)
    .fill(0)
    .map(() => ({ _id: faker.string.uuid(), name: faker.lorem.word() }));

  constructor(
    private readonly s3Service: S3Service,
    private readonly i18nService: I18nService,
  ) {
    this.seedDatabase(25);
  }

  private async copyImage(imageId: string): Promise<string> {
    const tempImageKey = S3_TEMP_FOLDER_NAME + '/' + imageId;
    const imageKey = this.dummyImagePath + imageId;
    await this.s3Service.copyObject(tempImageKey, imageKey);
    return this.s3Service.getPreSignedUrl(imageKey, SignedUrlMethod.GET);
  }

  getSeededRandomTagIds(tags: { _id: string }[]) {
    const count = faker.number.int({ min: 1, max: 10 });
    return faker.helpers.arrayElements(tags, count).map((tag) => tag._id);
  }

  private seedDatabase(count: number) {
    faker.seed(this.seed);
    this.productsDb = [];

    for (let i = 0; i < count; i++) {
      const randomTags = this.getSeededRandomTagIds(this.tags);

      this.productsDb.push({
        _id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        stock: faker.number.int({ min: 0, max: 100 }),
        image: faker.image.url(),
        dimensions: {
          width: faker.number.int({ min: 5, max: 50 }),
          height: faker.number.int({ min: 5, max: 50 }),
          depth: faker.number.int({ min: 5, max: 50 }),
          unit: 'cm',
        },
        isFake: true,
        category: {
          _id: faker.string.uuid(),
          name: faker.commerce.department(),
          slug: faker.lorem.slug(),
        },
        tags: randomTags,
        isActive: faker.datatype.boolean(),
        manufacturedAt: {
          city: faker.location.city(),
          state: faker.location.state(),
          street: faker.location.street(),
          zip: faker.location.zipCode(),
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      });
    }
  }

  @Query(() => FakeProductsListResponse)
  async getFakeProducts(@Args('input') input: GetFakeProductsInput) {
    const { limit, skip, searchText, orderBy, order, isActive, minPrice, maxPrice, tags } = input;
    let result = [...this.productsDb];

    // Search
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.sku.toLowerCase().includes(lowerSearch) ||
          p.category?.name.toLowerCase().includes(lowerSearch),
      );
    }

    if (isActive != null) {
      result = result.filter((p) => p.isActive === isActive);
    }

    if (minPrice != null) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice != null) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // 4. Filter: Tags (Check if product has ANY of the provided tags)
    if (tags && tags.length > 0) {
      result = result.filter(
        (p) => p.tags && p.tags.some((productTag) => tags.includes(productTag)),
      );
    }

    // Sort
    const validOrderBy = Object.keys(new FakeProductResponse()).includes(orderBy)
      ? orderBy
      : 'createdAt';
    result.sort((a, b) => {
      // Handle nested sorting or simple sorting
      let fieldA: any = a[validOrderBy];
      let fieldB: any = b[validOrderBy];

      if (fieldA === undefined) fieldA = '';
      if (fieldB === undefined) fieldB = '';

      // string comparison
      if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
      if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

      if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = result.length;
    const paginatedItems = result.slice(skip, skip + limit);
    const hasNextPage = skip + limit < totalCount;

    return {
      items: paginatedItems,
      pagination: {
        total: totalCount,
        hasNextPage: hasNextPage,
      },
    };
  }

  @Query(() => FakeProductResponse, { nullable: true })
  async getFakeProduct(@Args('id', { type: () => String }) id: string) {
    const product = this.productsDb.find((p) => p._id === id);
    if (!product) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Product' } }),
      );
    }
    const imageUrl =
      !product?.isFake && product?.image
        ? await this.s3Service.getPreSignedUrl(
            this.dummyImagePath + product.image,
            SignedUrlMethod.GET,
          )
        : product.image;
    return {
      ...product,
      imageUrl: imageUrl,
    };
  }

  @Query(() => FakeProductTagsResponse)
  async getFakeProductTags() {
    return {
      tags: this.tags,
    };
  }

  @Mutation(() => FakeProductResponse)
  async createFakeProduct(@Args('input') input: CreateFakeProductInput) {
    const newId = faker.string.uuid();

    let imageUrl = input.image;
    if (imageUrl) {
      imageUrl = await this.copyImage(imageUrl);
    }

    const newProduct: FakeProduct = {
      _id: newId,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Default nested objects if missing
      dimensions: input.dimensions || { width: 0, height: 0, depth: 0, unit: 'cm' },
      category: {
        ...(input.category || {
          _id: faker.string.uuid(),
          name: 'Uncategorized',
          slug: 'uncategorized',
        }),
      },
    };
    this.productsDb.unshift(newProduct);
    return {
      ...newProduct,
      imageUrl: imageUrl,
    };
  }

  @Mutation(() => FakeProductResponse)
  async updateFakeProduct(@Args('input') input: UpdateFakeProductInput) {
    const index = this.productsDb.findIndex((p) => p._id === input._id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${input._id} not found`);
    }

    const existingProduct = this.productsDb[index];

    // Check if image changed and needs moving
    let finalImageUrl = existingProduct.image;
    let isFake = existingProduct.isFake;

    if (input.image && input.image !== existingProduct.image) {
      finalImageUrl = await this.copyImage(input.image);
      isFake = false;
    }

    const updatedProduct = {
      ...existingProduct,
      ...input,
      isFake,
      updatedAt: new Date(),
    };

    this.productsDb[index] = updatedProduct;
    return {
      ...updatedProduct,
      imageUrl: finalImageUrl,
    };
  }

  @Mutation(() => Boolean)
  async deleteFakeProduct(@Args('id', { type: () => String }) id: string) {
    const initialLength = this.productsDb.length;
    this.productsDb = this.productsDb.filter((p) => p._id !== id);
    return this.productsDb.length !== initialLength;
  }

  @Mutation(() => Boolean)
  async resetFakeProducts(
    @Args('count', { type: () => Int, defaultValue: 25 }) count: number,
    @Args('seed', { type: () => Int, defaultValue: 1234 }) seed?: number,
  ) {
    this.seed = seed;
    this.seedDatabase(count);
    return true;
  }
}
