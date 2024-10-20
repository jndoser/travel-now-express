import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import { GetSavedRoomType } from "./user.model";

export const getSavedRoomsByUser = async (
  getSavedRoomData: GetSavedRoomType
) => {
  const user = await prisma.user.findFirst({
    where: {
      clerkId: getSavedRoomData.clerkId,
    },
  });
  if (user) {
    const skip = (getSavedRoomData.page - 1) * getSavedRoomData.limit;
    const userWithSavedRoom = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        savedRooms: {
          include: {
            feedback: { select: { rating: true } },
            savedUsers: { select: { id: true, clerkId: true } },
          },
          skip,
          take: getSavedRoomData.limit,
        },
      },
    });

    const total = (
      await prisma.user.findFirst({
        where: {
          id: user.id,
        },
        select: {
          savedRooms: true,
        },
      })
    )?.savedRooms.length;

    return { ...userWithSavedRoom, total };
  }
};

export const getUserInfoByClerkId = async (clerkId: string) => {
  try {
    const userInfo = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });

    return userInfo;
  } catch (error: any) {
    throw new HttpException(500, "Something went wrong");
  }
};
