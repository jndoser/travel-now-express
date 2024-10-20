import { Request, Response, Router } from "express";
import {
  approveRoom,
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  rejectRoom,
  saveRoom,
  unsaveRoom,
  updateRoom,
} from "./room.service";
import { GetRoomType } from "./room.model";

const router = Router();

router.post("/room", async (req: Request, res: Response) => {
  try {
    const id = await createRoom({ ...req.body });
    res.status(201).json(id);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/room", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const searchKeywords = req.query.searchKeywords as string;
    const clerkId = req.query.clerkId as string;

    const status = req.query.status as string;

    const getRoomData = {
      page,
      limit,
      searchKeywords,
      clerkId,
      status,
    } as GetRoomType;

    const rooms = await getRooms(getRoomData);
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/room/:roomId", async (req: Request, res: Response) => {
  try {
    const room = await getRoomById(req.params.roomId);
    res.json(room);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

router.put("/room/:roomId", async (req: Request, res: Response) => {
  try {
    const room = await updateRoom(req.params.roomId, { ...req.body });
    res.status(200).json(room);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

router.delete("/room/:roomId", async (req: Request, res: Response) => {
  try {
    const id = await deleteRoom(req.params.roomId);
    res.json(id);
  } catch (error: any) {
    res.status(error.errorCode).json({ message: error.message });
  }
});

router.put("/room/save/:roomId", async (req: Request, res: Response) => {
  const savedRoom = await saveRoom({
    roomId: req.params.roomId,
    clerkId: req.body.clerkId,
  });
  res.status(200).json(savedRoom);
});

router.put("/room/unsave/:roomId", async (req: Request, res: Response) => {
  const unsavedRoom = await unsaveRoom({
    roomId: req.params.roomId,
    clerkId: req.body.clerkId,
  });
  res.status(200).json(unsavedRoom);
});

router.put("/room/approve/:roomId", async (req: Request, res: Response) => {
  const approvedRoom = await approveRoom(req.params.roomId);
  res.status(200).json(approvedRoom);
});

router.put("/room/reject/:roomId", async (req: Request, res: Response) => {
  const rejectedRoom = await rejectRoom(req.params.roomId);
  res.status(200).json(rejectedRoom);
});

export default router;
