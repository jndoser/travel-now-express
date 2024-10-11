import { Request, Response, Router } from "express";
import { createFeedback, getFeedbackFromRoom } from "./room-feedback.service";
import { GetFeedbacksByRoomType } from "./room-feedback.model";

const router = Router();

router.get("/room-feedbacks/:roomId", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const getFeedbacksByRoomData = {
      page,
      limit,
      roomId: req.params.roomId,
    } as GetFeedbacksByRoomType;
    const feedbacks = await getFeedbackFromRoom(getFeedbacksByRoomData);
    res.json(feedbacks);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

router.post("/room-feedbacks", async (req: Request, res: Response) => {
  const newFeedback = await createFeedback({ ...req.body });
  res.json(newFeedback);
});

export default router;
