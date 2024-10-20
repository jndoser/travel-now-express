import { Request, Response, Router } from "express";
import {
  approveBookedRoom,
  createBookedRoom,
  getBookedDataByRoomId,
  getBookingRoomByUserId,
  rejectBookedRoom,
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
  const status = req.query.status as string;

  const getBookedInfoInput = {
    roomId: req.params.roomId,
    page,
    limit,
    searchKeywords,
    status,
  } as GetBookedInfoType;
  const bookedData = await getBookedDataByRoomId(getBookedInfoInput);
  res.status(200).json(bookedData);
});

router.put(
  "/room/booking/approve/:bookingId",
  async (req: Request, res: Response) => {
    const updatedBookingInfo = await approveBookedRoom(req.params.bookingId);
    res.status(200).json(updatedBookingInfo);
  }
);

router.put(
  "/room/booking/reject/:bookingId",
  async (req: Request, res: Response) => {
    const updatedBookingInfo = await rejectBookedRoom(req.params.bookingId);
    res.status(200).json(updatedBookingInfo);
  }
);

export default router;
