import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {
  CreateFeedbackType,
  GetFeedbacksByRoomType,
} from "./room-feedback.model";

export const createFeedback = async (
  createFeedbackData: CreateFeedbackType
) => {
  const newFeedback = await prisma.feedback.create({
    data: {
      roomId: createFeedbackData.roomId,
      authorId: createFeedbackData.authorId,
      rating: createFeedbackData.rating,
      comment: createFeedbackData.comment,
    },
  });

  return newFeedback;
};

export const getFeedbackFromRoom = async (
  getFeedbacksByRoomData: GetFeedbacksByRoomType
) => {
  const room = await prisma.room.findUnique({
    where: {
      id: getFeedbacksByRoomData.roomId,
    },
  });
  if (!room) {
    throw new HttpException(404, "This room is not exist");
  }
  const skip = (getFeedbacksByRoomData.page - 1) * getFeedbacksByRoomData.limit;

  const feedbacks = await prisma.feedback.findMany({
    where: {
      roomId: getFeedbacksByRoomData.roomId,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    skip,
    take: getFeedbacksByRoomData.limit,
    orderBy: { createdAt: "desc" },
  });

  const total = (
    await prisma.feedback.findMany({
      where: {
        roomId: getFeedbacksByRoomData.roomId,
      },
    })
  ).length;

  return { feedbacks, total };
};
