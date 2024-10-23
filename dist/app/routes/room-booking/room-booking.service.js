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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectBookedRoom = exports.approveBookedRoom = exports.getBookedDataByRoomId = exports.createBookedRoom = exports.getBookingRoomByUserId = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const getBookingRoomByUserId = (getBookingHistoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: { clerkId: getBookingHistoryData.clerkId },
    });
    if (!user) {
        throw new http_exception_model_1.default(404, "User not found");
    }
    try {
        const skip = (getBookingHistoryData.page - 1) * getBookingHistoryData.limit;
        const bookedRooms = yield prisma_client_1.default.booking.findMany({
            where: { userId: user.id },
            include: {
                room: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        address: true,
                        imageUrls: true,
                    },
                },
            },
            skip,
            take: getBookingHistoryData.limit,
        });
        const total = (yield prisma_client_1.default.booking.findMany({ where: { userId: user.id } })).length;
        return { bookedRooms, total };
    }
    catch (error) { }
});
exports.getBookingRoomByUserId = getBookingRoomByUserId;
const createBookedRoom = (createBookedRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: { clerkId: createBookedRoomData.clerkId },
    });
    const room = yield prisma_client_1.default.room.findFirst({
        where: { id: createBookedRoomData.roomId },
    });
    if (!user || !room) {
        throw new http_exception_model_1.default(404, "User or room not found");
    }
    try {
        const newBookedRoom = yield prisma_client_1.default.booking.create({
            data: {
                roomId: createBookedRoomData.roomId,
                userId: user.id,
                numberOfPeople: createBookedRoomData.numberOfPeople,
                bookedDate: createBookedRoomData.bookedDate,
                status: "Pending Approval",
            },
        });
        return newBookedRoom;
    }
    catch (error) {
        console.log(error);
        throw new http_exception_model_1.default(500, "Something went wrong");
    }
});
exports.createBookedRoom = createBookedRoom;
const getBookedDataByRoomId = (getBookedInfoData) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield prisma_client_1.default.room.findFirst({
        where: { id: getBookedInfoData.roomId },
    });
    if (!room) {
        throw new http_exception_model_1.default(404, "Room not found");
    }
    try {
        const skip = (getBookedInfoData.page - 1) * getBookedInfoData.limit;
        const bookedData = yield prisma_client_1.default.booking.findMany({
            where: {
                roomId: getBookedInfoData.roomId,
                status: getBookedInfoData.status,
            },
            include: { user: true },
            skip,
            take: getBookedInfoData.limit,
        });
        const total = (yield prisma_client_1.default.booking.findMany({
            where: { roomId: getBookedInfoData.roomId },
        })).length;
        return { bookedData, total };
    }
    catch (error) {
        throw new http_exception_model_1.default(500, "Something went wrong");
    }
});
exports.getBookedDataByRoomId = getBookedDataByRoomId;
const approveBookedRoom = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingInfo = yield prisma_client_1.default.booking.findUnique({
        where: { id: bookingId },
    });
    if (!bookingInfo) {
        throw new http_exception_model_1.default(404, "Booking info not found");
    }
    const updatedBookingInfo = yield prisma_client_1.default.booking.update({
        where: { id: bookingId },
        data: { status: "Approved" },
    });
    return Object.assign({}, updatedBookingInfo);
});
exports.approveBookedRoom = approveBookedRoom;
const rejectBookedRoom = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingInfo = yield prisma_client_1.default.booking.findUnique({
        where: { id: bookingId },
    });
    if (!bookingInfo) {
        throw new http_exception_model_1.default(404, "Booking info not found");
    }
    const updatedBookingInfo = yield prisma_client_1.default.booking.update({
        where: { id: bookingId },
        data: { status: "Rejected" },
    });
    return Object.assign({}, updatedBookingInfo);
});
exports.rejectBookedRoom = rejectBookedRoom;
