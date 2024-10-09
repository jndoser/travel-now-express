export interface CreateUserData {
  firstName: string;
  lastName: string;
  sex: string;
  age: number;
  address: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginUserData {
  username: string | undefined;
  password: string | undefined;
}

export interface UpdateUserData {
  firstName: string | undefined;
  lastName: string | undefined;
  sex: string | undefined;
  age: number | undefined;
  address: string | undefined;
  phoneNumber: string | undefined;
  email: string | undefined;
  username: string | undefined;
  password: string | undefined;
}
