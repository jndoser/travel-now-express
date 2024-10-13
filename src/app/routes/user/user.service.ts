import prisma from "../../../prisma/prisma-client";
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
