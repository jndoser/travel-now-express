import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {
  CreateBookedRoomType,
  GetBookedInfoType,
  GetBookingHistoryType,
} from "./room-booking.model";

export const getBookingRoomByUserId = async (
  getBookingHistoryData: GetBookingHistoryType
) => {
  const user = await prisma.user.findFirst({
    where: { clerkId: getBookingHistoryData.clerkId },
  });
  if (!user) {
    throw new HttpException(404, "User not found");
  }
  try {
    const skip = (getBookingHistoryData.page - 1) * getBookingHistoryData.limit;
    const bookedRooms = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        room: {
          select: {
            id: true,
            title: true,
            description: true,
            address: true,
            imageUrls: true,
          },
        },
      },
      skip,
      take: getBookingHistoryData.limit,
    });

    const total = (
      await prisma.booking.findMany({ where: { userId: user.id } })
    ).length;

    return { bookedRooms, total };
  } catch (error) {}
};

export const createBookedRoom = async (
  createBookedRoomData: CreateBookedRoomType
) => {
  const user = await prisma.user.findFirst({
    where: { clerkId: createBookedRoomData.clerkId },
  });
  const room = await prisma.room.findFirst({
    where: { id: createBookedRoomData.roomId },
  });
  if (!user || !room) {
    throw new HttpException(404, "User or room not found");
  }
  try {
    const newBookedRoom = await prisma.booking.create({
      data: {
        roomId: createBookedRoomData.roomId,
        userId: user.id,
        numberOfPeople: createBookedRoomData.numberOfPeople,
        bookedDate: createBookedRoomData.bookedDate,
        status: "Pending Approval"
      },
    });
    return newBookedRoom;
  } catch (error: any) {
    console.log(error);
    throw new HttpException(500, "Something went wrong");
  }
};

export const getBookedDataByRoomId = async (
  getBookedInfoData: GetBookedInfoType
) => {
  const room = await prisma.room.findFirst({
    where: { id: getBookedInfoData.roomId },
  });
  if (!room) {
    throw new HttpException(404, "Room not found");
  }
  try {
    const skip = (getBookedInfoData.page - 1) * getBookedInfoData.limit;
    const bookedData = await prisma.booking.findMany({
      where: { roomId: getBookedInfoData.roomId },
      include: { user: true },
      skip,
      take: getBookedInfoData.limit,
    });

    const total = (
      await prisma.booking.findMany({
        where: { roomId: getBookedInfoData.roomId },
      })
    ).length;

    return { bookedData, total };
  } catch (error) {
    throw new HttpException(500, "Something went wrong");
  }
};
