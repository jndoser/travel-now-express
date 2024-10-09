import { Request, Response, Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoomById,
  getRooms,
  updateRoom,
} from "./room.service";

const router = Router();

router.post("/room", async (req: Request, res: Response) => {
  try {
    const id = await createRoom({ ...req.body });
    res.json(id);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/room", async (req: Request, res: Response) => {
  try {
    const rooms = await getRooms();
    res.json(rooms);
  } catch (error) {
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
    res.json(room);
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

export default router;
