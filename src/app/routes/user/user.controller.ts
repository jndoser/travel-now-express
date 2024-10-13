import { Request, Response, Router } from "express";
import { getSavedRoomsByUser } from "./user.service";

const router = Router();

router.get("/user/saved-rooms/:clerkId", async (req: Request, response: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;

  const savedRooms = await getSavedRoomsByUser({
    clerkId: req.params.clerkId,
    page,
    limit,
  });
  response.status(200).json({...savedRooms});
});

export default router;
