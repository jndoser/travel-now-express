import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import { CreateRoomType, UpdateRoomType } from "./room.model";

export const createRoom = async (room: CreateRoomType) => {
  const { id } = await prisma.room.create({
    data: {
      title: room.title,
      description: room.description,
      address: room.address,
      capacity: room.capacity,
      price: room.price,
      imageUrls: room.imageUrls,
      status: "in progress",
      owner: {
        connect: {
          id: room.ownerId,
        },
      },
      services: {
        connect: room.serviceIds.map((item: string) => ({ id: item })),
      },
    },
  });
  return id;
};

export const getRooms = async () => {
  const rooms = await prisma.room.findMany({
    include: { feedback: { select: { rating: true } } },
  });
  return rooms;
};

export const getRoomById = async (id: string) => {
  const room = await prisma.room.findFirst({
    where: {
      id,
    },
    include: {
      feedback: {
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      owner: true,
      services: true,
    },
  });
  if (!room) {
    throw new HttpException(404, "Not found this room");
  }
  return room;
};

export const updateRoom = async (
  id: string,
  updateRoomData: UpdateRoomType
) => {
  if (!id) {
    throw new HttpException(401, "Please provide the room id");
  }

  const existingRoom = await prisma.room.findUnique({
    where: {
      id,
    },
  });

  if (!existingRoom) {
    throw new HttpException(404, "This room does not exist");
  }

  const room = await prisma.room.update({
    where: {
      id,
    },
    data: {
      ...(updateRoomData.title ? { title: updateRoomData.title } : {}),
      ...(updateRoomData.description
        ? { description: updateRoomData.description }
        : {}),
      ...(updateRoomData.address ? { address: updateRoomData.address } : {}),
      ...(updateRoomData.capacity ? { capacity: updateRoomData.capacity } : {}),
      ...(updateRoomData.price ? { price: updateRoomData.price } : {}),
      ...(updateRoomData.imageUrls
        ? { imageUrls: updateRoomData.imageUrls }
        : {}),
      status: "in progress",
      ...(updateRoomData.ownerId ? { ownerId: updateRoomData.ownerId } : {}),
      services: {
        connect: updateRoomData.serviceIDs
          ? updateRoomData.serviceIDs.map((id) => ({ id }))
          : [],
        disconnect:
          existingRoom.serviceIDs && updateRoomData.serviceIDs
            ? existingRoom.serviceIDs
                .filter((service) =>
                  updateRoomData.serviceIDs?.includes(service)
                )
                .map((service) => ({ id: service }))
            : [],
      },
    },
  });
  return room;
};

export const deleteRoom = async (id: string) => {
  if (!id) {
    throw new HttpException(401, "Please provide the room id");
  }
  const { id: roomId } = await prisma.room.delete({
    where: {
      id,
    },
  });
  return roomId;
};
