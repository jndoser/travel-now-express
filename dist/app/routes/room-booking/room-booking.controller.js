"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_booking_service_1 = require("./room-booking.service");
const router = (0, express_1.Router)();
router.post("/room/booking", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBookedRoom = yield (0, room_booking_service_1.createBookedRoom)(Object.assign({}, req.body));
    res.status(201).json(newBookedRoom);
}));
router.get("/room/user/booking/:clerkId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const searchKeywords = req.query.searchKeywords;
    const getBookingRoomByUserInput = {
        clerkId: req.params.clerkId,
        page,
        limit,
        searchKeywords,
    };
    const bookedRooms = yield (0, room_booking_service_1.getBookingRoomByUserId)(getBookingRoomByUserInput);
    res.status(200).json(bookedRooms);
}));
router.get("/room/booking/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const searchKeywords = req.query.searchKeywords;
    const status = req.query.status;
    const getBookedInfoInput = {
        roomId: req.params.roomId,
        page,
        limit,
        searchKeywords,
        status,
    };
    const bookedData = yield (0, room_booking_service_1.getBookedDataByRoomId)(getBookedInfoInput);
    res.status(200).json(bookedData);
}));
router.put("/room/booking/approve/:bookingId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBookingInfo = yield (0, room_booking_service_1.approveBookedRoom)(req.params.bookingId);
    res.status(200).json(updatedBookingInfo);
}));
router.put("/room/booking/reject/:bookingId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBookingInfo = yield (0, room_booking_service_1.rejectBookedRoom)(req.params.bookingId);
    res.status(200).json(updatedBookingInfo);
}));
exports.default = router;
