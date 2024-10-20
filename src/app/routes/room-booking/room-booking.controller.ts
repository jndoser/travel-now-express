import { Request, Response, Router } from "express";
import {
  createBookedRoom,
  getBookedDataByRoomId,
  getBookingRoomByUserId,
} from "./room-booking.service";
import { GetBookedInfoType, GetBookingHistoryType } from "./room-booking.model";

const router = Router();

router.post("/room/booking", async (req: Request, res: Response) => {
  const newBookedRoom = await createBookedRoom({ ...req.body });
  res.status(201).json(newBookedRoom);
});

router.get(
  "/room/user/booking/:clerkId",
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const searchKeywords = req.query.searchKeywords as string;

    const getBookingRoomByUserInput = {
      clerkId: req.params.clerkId,
      page,
      limit,
      searchKeywords,
    } as GetBookingHistoryType;

    const bookedRooms = await getBookingRoomByUserId(getBookingRoomByUserInput);
    res.status(200).json(bookedRooms);
  }
);

router.get("/room/booking/:roomId", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 6;
  const searchKeywords = req.query.searchKeywords as string;

  const getBookedInfoInput = {
    roomId: req.params.roomId,
    page,
    limit,
    searchKeywords,
  } as GetBookedInfoType;
  const bookedData = await getBookedDataByRoomId(getBookedInfoInput);
  res.status(200).json(bookedData);
});

export default router;
