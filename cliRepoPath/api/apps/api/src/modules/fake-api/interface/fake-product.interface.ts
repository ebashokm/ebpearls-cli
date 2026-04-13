export interface FakeProduct {
  _id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  dimensions?: FakeProductDimensions;
  category?: FakeProductCategory;
  tags?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  isFake?: boolean;
  manufacturedAt?: FakeManufacturerAddress;
}

export interface FakeProductDimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

export interface FakeProductCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface FakeManufacturerAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}
