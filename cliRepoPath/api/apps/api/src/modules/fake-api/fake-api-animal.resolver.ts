import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { faker } from '@faker-js/faker';
import { AnimalResponse, AnimalsListResponse } from './dto/response/animal.response';
import { CreateAnimalInput, GetAnimalsInput, UpdateAnimalInput } from './dto/input/animal.input';
import { Animal } from './interface/animal.interface';

@Resolver(() => AnimalResponse)
export class FakeAnimalApiResolver {
  private animalsDb: Animal[] = [];
  private seed = 1234;

  constructor() {
    this.seedDatabase(25);
  }

  private seedDatabase(count: number) {
    faker.seed(this.seed);
    this.animalsDb = [];
    for (let i = 0; i < count; i++) {
      this.animalsDb.push({
        _id: faker.string.uuid(),
        name: faker.animal.petName(),
        species: faker.animal.type(),
        age: faker.number.int({ min: 1, max: 20 }),
        address: {
          city: faker.location.city(),
          state: faker.location.state(),
          street: faker.location.street(),
          zip: faker.location.zipCode(),
        },
        color: faker.color.rgb(),
        weight: faker.number.int({ min: 1, max: 20 }),
        height: faker.number.int({ min: 1, max: 20 }),
        gender: faker.person.gender(),
        isVaccinated: faker.datatype.boolean(),
        isNeutered: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        foods: [faker.food.meat(), faker.food.meat(), faker.food.vegetable()],
      });
    }
  }

  @Query(() => AnimalsListResponse)
  async getAnimals(@Args('input') input: GetAnimalsInput) {
    const { limit, skip, searchText, orderBy, order } = input;
    let result = [...this.animalsDb];
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(lowerSearch) ||
          a.species.toLowerCase().includes(lowerSearch),
      );
    }

    const validOrderBy = Object.keys(new AnimalResponse()).includes(orderBy) ? orderBy : '_id';
    result.sort((a, b) => {
      const fieldA = a[validOrderBy] !== undefined ? String(a[validOrderBy]).toLowerCase() : '';
      const fieldB = b[validOrderBy] !== undefined ? String(b[validOrderBy]).toLowerCase() : '';

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

  @Query(() => AnimalResponse, { nullable: true })
  async getAnimal(@Args('id', { type: () => String }) id: string) {
    return this.animalsDb.find((a) => a._id === id);
  }

  @Mutation(() => AnimalResponse)
  async createAnimal(@Args('input') input: CreateAnimalInput) {
    const newAnimal: Animal = {
      _id: faker.string.uuid(),
      ...input,
    };
    this.animalsDb.unshift(newAnimal);
    return newAnimal;
  }

  @Mutation(() => AnimalResponse)
  async updateAnimal(@Args('input') input: UpdateAnimalInput) {
    const index = this.animalsDb.findIndex((a) => a._id === input._id);
    if (index === -1) {
      throw new Error(`Animal with ID ${input._id} not found`);
    }

    const updatedAnimal = {
      ...this.animalsDb[index],
      ...input,
      _id: this.animalsDb[index]._id,
    };

    this.animalsDb[index] = updatedAnimal;
    return updatedAnimal;
  }

  @Mutation(() => Boolean)
  async deleteAnimal(@Args('id', { type: () => String }) id: string) {
    const initialLength = this.animalsDb.length;
    this.animalsDb = this.animalsDb.filter((a) => a._id !== id);

    return this.animalsDb.length !== initialLength;
  }

  @Mutation(() => Boolean)
  async resetAnimals(
    @Args('count', { type: () => Int, defaultValue: 25 }) count: number,
    @Args('seed', { type: () => Int, defaultValue: 1234 }) seed?: number,
  ) {
    this.seed = seed;
    this.seedDatabase(count);
    return true;
  }
}
