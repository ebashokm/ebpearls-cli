export interface Animal {
  _id: string;
  name: string;
  species: string;
  age: number;
  address?: Address;
  color?: string;
  weight?: number;
  height?: number;
  createdAt?: Date;
  updatedAt?: Date;
  gender?: string;
  isNeutered?: boolean;
  isVaccinated?: boolean;
  foods?: string[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}
