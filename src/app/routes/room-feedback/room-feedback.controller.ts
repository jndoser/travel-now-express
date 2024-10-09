import { Request, Response, Router } from "express";
import { createFeedback, getFeedbackFromRoom } from "./room-feedback.service";

const router = Router();

router.get("/room-feedbacks/:roomId", async (req: Request, res: Response) => {
  try {
    const feedbacks = await getFeedbackFromRoom(req.params.roomId);
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
