import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import { CreateUserData, LoginUserData, UpdateUserData } from "./auth.model";
import { generateToken } from "./token.utils";
import bycrypt from "bcryptjs";

export const createUser = async (userInputData: CreateUserData) => {
  const email = userInputData.email?.trim();
  const username = userInputData.username?.trim();
  const password = userInputData.password?.trim();

  if (!email) {
    throw new HttpException(422, "Email can not be blank");
  }

  if (!username) {
    throw new HttpException(422, "Username can not be blank");
  }

  if (!password) {
    throw new HttpException(422, "Password can not be blank");
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByEmail || existingUserByUsername) {
    throw new HttpException(422, "Email or username has been taken");
  }
  const hashedPassword = await bycrypt.hash(password, 10);

  const { id } = await prisma.user.create({
    data: {
      firstName: userInputData.firstName,
      lastName: userInputData.lastName,
      sex: userInputData.sex,
      age: userInputData.age,
      address: userInputData.address,
      phoneNumber: userInputData.phoneNumber,
      email: userInputData.email,
      username: userInputData.username,
      password: hashedPassword,
      role: "user",
    },
  });

  return {
    userId: id,
    token: generateToken(id),
  };
};

export const login = async (userInputData: LoginUserData) => {
  const username = userInputData.username?.trim();
  const password = userInputData.password?.trim();

  if (!username) {
    throw new HttpException(422, "Username must not be blank");
  }

  if (!password) {
    throw new HttpException(422, "Username must not be blank");
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new HttpException(404, "User not found");
  }

  const match = await bycrypt.compare(password, user.password);
  if (match) {
    const { password, ...returnData } = user;
    return {
      user: returnData,
      token: generateToken(user.id),
    };
  } else {
    throw new HttpException(401, "Password is incorrect");
  }
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      rooms: true,
    }
  });

  if (!user) {
    throw new HttpException(404, "User is not exist");
  }
  const { password, ...returnData } = user;
  return {
    user: returnData,
    token: generateToken(user.id),
  };
};

export const updateUser = async (
  userDataToUpdate: UpdateUserData,
  userId: string
) => {
  const {
    firstName,
    lastName,
    sex,
    age,
    address,
    phoneNumber,
    email,
    username,
    password,
  } = userDataToUpdate;

  let hashedPassword;
  if (password) {
    hashedPassword = await bycrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(sex ? { sex } : {}),
      ...(age ? { age } : {}),
      ...(address ? { address } : {}),
      ...(phoneNumber ? { phoneNumber } : {}),
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
      ...(password ? { password: hashedPassword } : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      sex: true,
      age: true,
      address: true,
      phoneNumber: true,
      email: true,
      username: true,
    },
  });

  return {
    user: updatedUser,
    token: generateToken(updatedUser.id),
  };
};
