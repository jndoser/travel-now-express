import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import { CreateFeedbackType } from "./room-feedback.model";

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

export const getFeedbackFromRoom = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) {
    throw new HttpException(404, "This room is not exist");
  }
  const feedbacks = await prisma.feedback.findMany({
    where: {
      roomId,
    },
  });
  return feedbacks;
};
