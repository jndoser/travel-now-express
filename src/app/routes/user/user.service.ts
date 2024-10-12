import prisma from "../../../prisma/prisma-client";

export const getSavedRoomsByUser = async (clerkId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      clerkId,
    },
  });
  if (user) {
    const savedRooms = await prisma.user.findMany({
      where: {
        id: user.id,
      },
      select: {
        savedRooms: true,
      },
    });
    return savedRooms;
  }
};
