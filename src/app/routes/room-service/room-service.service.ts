import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import { CreateServiceType, UpdateServiceType } from "./room-service.model";

export const getServices = async () => {
  const services = await prisma.service.findMany({});
  return services;
};

export const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id,
    },
  });
  return service;
};

export const createService = async (createServiceData: CreateServiceType) => {
  const title = createServiceData.title.trim();

  const existingService = await prisma.service.findUnique({
    where: {
      title,
    },
  });

  if (existingService) {
    throw new HttpException(
      401,
      "This service is already exist. Please choose another name"
    );
  }

  const newService = await prisma.service.create({
    data: {
      title,
      ...(createServiceData.imageUrl
        ? { imageUrl: createServiceData.imageUrl }
        : {}),
    },
  });

  return newService;
};

export const updateService = async (
  id: string,
  updateServiceData: UpdateServiceType
) => {
  if (!id) {
    throw new HttpException(401, "Please provide the service id");
  }
  const updatedService = await prisma.service.update({
    where: {
      id,
    },
    data: {
      title: updateServiceData.title,
      ...(updateServiceData.imageUrl
        ? { imageUrl: updateServiceData.imageUrl }
        : {}),
    },
    select: {
      title: true,
      imageUrl: true,
    },
  });
  return updatedService;
};

export const deleteService = async (id: string) => {
  if (!id) {
    throw new HttpException(401, "Please provide the room id");
  }
  const { id: serviceId } = await prisma.service.delete({
    where: {
      id,
    },
  });
  return serviceId;
};
