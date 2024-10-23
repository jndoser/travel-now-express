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
exports.rejectRoom = exports.approveRoom = exports.unsaveRoom = exports.saveRoom = exports.deleteRoom = exports.updateRoom = exports.getRoomById = exports.getRooms = exports.createRoom = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const createRoom = (room) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_client_1.default.user.findFirst({
            where: { clerkId: room.ownerId },
        });
        if (user) {
            const { id } = yield prisma_client_1.default.room.create({
                data: {
                    title: room.title,
                    description: room.description,
                    address: room.address,
                    capacity: room.capacity,
                    price: room.price,
                    imageUrls: room.imageUrls,
                    status: "in progress",
                    ownerId: user.id,
                    serviceIDs: room.serviceIds,
                },
            });
            return id;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.createRoom = createRoom;
const getRooms = (getRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = (getRoomData.page - 1) * getRoomData.limit;
        let userId;
        if (getRoomData.clerkId) {
            const userInfo = yield prisma_client_1.default.user.findFirst({
                where: {
                    clerkId: getRoomData.clerkId,
                },
            });
            if (userInfo) {
                userId = userInfo.id;
            }
            else {
                userId = undefined;
            }
        }
        else {
            userId = undefined;
        }
        const rooms = yield prisma_client_1.default.room.findMany({
            where: Object.assign(Object.assign({ status: getRoomData.status }, (userId ? { ownerId: userId } : {})), (getRoomData.searchKeywords
                ? { title: { contains: getRoomData.searchKeywords } }
                : {})),
            skip,
            take: getRoomData.limit,
            include: {
                feedback: { select: { rating: true } },
                savedUsers: { select: { id: true, clerkId: true } },
            },
        });
        const totalRoom = (yield prisma_client_1.default.room.findMany({
            where: Object.assign(Object.assign({ status: getRoomData.status }, (userId ? { ownerId: userId } : {})), (getRoomData.searchKeywords
                ? { title: { contains: getRoomData.searchKeywords } }
                : {})),
        })).length;
        return { rooms, total: totalRoom };
    }
    catch (error) {
        console.log(error);
    }
});
exports.getRooms = getRooms;
const getRoomById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield prisma_client_1.default.room.findFirst({
            where: {
                id,
            },
            include: {
                feedback: {
                    include: {
                        author: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                savedUsers: true,
                owner: true,
                services: true,
            },
        });
        if (!room) {
            throw new http_exception_model_1.default(404, "Not found this room");
        }
        return room;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getRoomById = getRoomById;
const updateRoom = (id, updateRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, "Please provide the room id");
    }
    const existingRoom = yield prisma_client_1.default.room.findUnique({
        where: {
            id,
        },
    });
    if (!existingRoom) {
        throw new http_exception_model_1.default(404, "This room does not exist");
    }
    try {
        const room = yield prisma_client_1.default.room.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (updateRoomData.title ? { title: updateRoomData.title } : {})), (updateRoomData.description
                ? { description: updateRoomData.description }
                : {})), (updateRoomData.address ? { address: updateRoomData.address } : {})), (updateRoomData.capacity
                ? { capacity: updateRoomData.capacity }
                : {})), (updateRoomData.price ? { price: updateRoomData.price } : {})), (updateRoomData.imageUrls
                ? { imageUrls: updateRoomData.imageUrls }
                : {})), { status: "in progress" }), (updateRoomData.ownerId ? { ownerId: updateRoomData.ownerId } : {})), { services: {
                    connect: updateRoomData.serviceIDs
                        ? updateRoomData.serviceIDs.map((id) => ({ id }))
                        : [],
                    disconnect: existingRoom.serviceIDs && updateRoomData.serviceIDs
                        ? existingRoom.serviceIDs
                            .filter((service) => { var _a; return !((_a = updateRoomData.serviceIDs) === null || _a === void 0 ? void 0 : _a.includes(service)); })
                            .map((service) => ({ id: service }))
                        : [],
                } }),
        });
        return room;
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateRoom = updateRoom;
const deleteRoom = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, "Please provide the room id");
    }
    const { id: roomId } = yield prisma_client_1.default.room.delete({
        where: {
            id,
        },
    });
    return roomId;
});
exports.deleteRoom = deleteRoom;
const saveRoom = (savedRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            clerkId: savedRoomData.clerkId,
        },
    });
    if (user) {
        const savedRoom = yield prisma_client_1.default.room.update({
            where: {
                id: savedRoomData.roomId,
            },
            data: {
                savedUsers: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        return savedRoom;
    }
});
exports.saveRoom = saveRoom;
const unsaveRoom = (unsavedRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            clerkId: unsavedRoomData.clerkId,
        },
    });
    if (user) {
        const updatedRoom = yield prisma_client_1.default.room.update({
            where: {
                id: unsavedRoomData.roomId,
            },
            data: {
                savedUsers: {
                    disconnect: {
                        id: user.id,
                    },
                },
            },
        });
        return updatedRoom;
    }
});
exports.unsaveRoom = unsaveRoom;
const approveRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const roomToUpdate = yield prisma_client_1.default.room.findFirst({ where: { id: roomId } });
    if (!roomToUpdate) {
        throw new http_exception_model_1.default(404, "Room not found");
    }
    const newRoom = yield prisma_client_1.default.room.update({
        where: { id: roomId },
        data: { status: "approved" },
    });
    return newRoom;
});
exports.approveRoom = approveRoom;
const rejectRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const roomToUpdate = yield prisma_client_1.default.room.findFirst({ where: { id: roomId } });
    if (!roomToUpdate) {
        throw new http_exception_model_1.default(404, "Room not found");
    }
    const newRoom = yield prisma_client_1.default.room.update({
        where: { id: roomId },
        data: { status: "rejected" },
    });
    return newRoom;
});
exports.rejectRoom = rejectRoom;
