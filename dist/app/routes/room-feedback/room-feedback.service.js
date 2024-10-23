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
exports.getFeedbackFromRoom = exports.createFeedback = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const createFeedback = (createFeedbackData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findFirst({
        where: { clerkId: createFeedbackData.clerkId },
    });
    if (user) {
        const newFeedback = yield prisma_client_1.default.feedback.create({
            data: {
                roomId: createFeedbackData.roomId,
                authorId: user.id,
                rating: createFeedbackData.rating,
                comment: createFeedbackData.comment,
            },
        });
        return newFeedback;
    }
});
exports.createFeedback = createFeedback;
const getFeedbackFromRoom = (getFeedbacksByRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield prisma_client_1.default.room.findUnique({
        where: {
            id: getFeedbacksByRoomData.roomId,
        },
    });
    if (!room) {
        throw new http_exception_model_1.default(404, "This room is not exist");
    }
    const skip = (getFeedbacksByRoomData.page - 1) * getFeedbacksByRoomData.limit;
    const feedbacks = yield prisma_client_1.default.feedback.findMany({
        where: {
            roomId: getFeedbacksByRoomData.roomId,
        },
        include: {
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
        skip,
        take: getFeedbacksByRoomData.limit,
        orderBy: { createdAt: "desc" },
    });
    const total = (yield prisma_client_1.default.feedback.findMany({
        where: {
            roomId: getFeedbacksByRoomData.roomId,
        },
    })).length;
    return { feedbacks, total };
});
exports.getFeedbackFromRoom = getFeedbackFromRoom;
