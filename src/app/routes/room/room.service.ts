import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {
  CreateRoomType,
  GetRoomType,
  SavedRoomType,
  UnsavedRoomType,
  UpdateRoomType,
} from "./room.model";

export const createRoom = async (room: CreateRoomType) => {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: room.ownerId },
    });
    if (user) {
      const { id } = await prisma.room.create({
        data: {
          title: room.title,
          description: room.description,
          address: room.address,
          capacity: room.capacity,
          price: room.price,
          imageUrls: room.imageUrls,
          status: "in progress",
          ownerId: user.id,
          serviceIDs: room.serviceIds,
        },
      });
      return id;
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const getRooms = async (getRoomData: GetRoomType) => {
  try {
    const skip = (getRoomData.page - 1) * getRoomData.limit;
    let userId: string | undefined;
    if (getRoomData.clerkId) {
      const userInfo = await prisma.user.findFirst({
        where: {
          clerkId: getRoomData.clerkId,
        },
      });
      if (userInfo) {
        userId = userInfo.id;
      } else {
        userId = undefined;
      }
    } else {
      userId = undefined;
    }

    const rooms = await prisma.room.findMany({
      where: {
        ...(userId ? { ownerId: userId } : {}),
        ...(getRoomData.searchKeywords
          ? { title: { contains: getRoomData.searchKeywords } }
          : {}),
      },
      skip,
      take: getRoomData.limit,
      include: {
        feedback: { select: { rating: true } },
        savedUsers: { select: { id: true, clerkId: true } },
      },
    });

    const totalRoom = (
      await prisma.room.findMany({
        where: {
          ...(userId ? { ownerId: userId } : {}),
          ...(getRoomData.searchKeywords
            ? { title: { contains: getRoomData.searchKeywords } }
            : {}),
        },
      })
    ).length;

    return { rooms, total: totalRoom };
  } catch (error: any) {
    console.log(error);
  }
};

export const getRoomById = async (id: string) => {
  try {
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
        savedUsers: true,
        owner: true,
        services: true,
      },
    });
    if (!room) {
      throw new HttpException(404, "Not found this room");
    }
    return room;
  } catch (err: any) {
    console.log(err);
  }
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
  try {
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
        ...(updateRoomData.capacity
          ? { capacity: updateRoomData.capacity }
          : {}),
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
                  .filter(
                    (service) => !updateRoomData.serviceIDs?.includes(service)
                  )
                  .map((service) => ({ id: service }))
              : [],
        },
      },
    });
    return room;
  } catch (error) {
    console.log(error);
  }
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

export const saveRoom = async (savedRoomData: SavedRoomType) => {
  const user = await prisma.user.findFirst({
    where: {
      clerkId: savedRoomData.clerkId,
    },
  });

  if (user) {
    const savedRoom = await prisma.room.update({
      where: {
        id: savedRoomData.roomId,
      },
      data: {
        savedUsers: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return savedRoom;
  }
};

export const unsaveRoom = async (unsavedRoomData: UnsavedRoomType) => {
  const user = await prisma.user.findFirst({
    where: {
      clerkId: unsavedRoomData.clerkId,
    },
  });

  if (user) {
    const updatedRoom = await prisma.room.update({
      where: {
        id: unsavedRoomData.roomId,
      },
      data: {
        savedUsers: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
    return updatedRoom;
  }
};

export const approveRoom = async (roomId: string) => {
  const roomToUpdate = await prisma.room.findFirst({ where: { id: roomId } });
  if (!roomToUpdate) {
    throw new HttpException(404, "Room not found");
  }
  const newRoom = await prisma.room.update({
    where: { id: roomId },
    data: { status: "approved" },
  });
  return newRoom;
};

export const rejectRoom = async (roomId: string) => {
  const roomToUpdate = await prisma.room.findFirst({ where: { id: roomId } });
  if (!roomToUpdate) {
    throw new HttpException(404, "Room not found");
  }
  const newRoom = await prisma.room.update({
    where: { id: roomId },
    data: { status: "rejected" },
  });
  return newRoom;
};
