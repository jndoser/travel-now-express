import { Request, Response, Router } from "express";
import { getSavedRoomsByUser } from "./user.service";

const router = Router();

router.get("/user/saved-rooms", async (req: Request, response: Response) => {
  const savedRooms = await getSavedRoomsByUser(req.body.clerkId);
  response.status(200).json(savedRooms);
});

export default router;
