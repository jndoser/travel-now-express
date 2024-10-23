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
exports.getUserInfoByClerkId = exports.getSavedRoomsByUser = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const getSavedRoomsByUser = (getSavedRoomData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma_client_1.default.user.findFirst({
        where: {
            clerkId: getSavedRoomData.clerkId,
        },
    });
    if (user) {
        const skip = (getSavedRoomData.page - 1) * getSavedRoomData.limit;
        const userWithSavedRoom = yield prisma_client_1.default.user.findFirst({
            where: {
                id: user.id,
            },
            select: {
                savedRooms: {
                    include: {
                        feedback: { select: { rating: true } },
                        savedUsers: { select: { id: true, clerkId: true } },
                    },
                    skip,
                    take: getSavedRoomData.limit,
                },
            },
        });
        const total = (_a = (yield prisma_client_1.default.user.findFirst({
            where: {
                id: user.id,
            },
            select: {
                savedRooms: true,
            },
        }))) === null || _a === void 0 ? void 0 : _a.savedRooms.length;
        return Object.assign(Object.assign({}, userWithSavedRoom), { total });
    }
});
exports.getSavedRoomsByUser = getSavedRoomsByUser;
const getUserInfoByClerkId = (clerkId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield prisma_client_1.default.user.findFirst({
            where: {
                clerkId,
            },
        });
        return userInfo;
    }
    catch (error) {
        throw new http_exception_model_1.default(500, "Something went wrong");
    }
});
exports.getUserInfoByClerkId = getUserInfoByClerkId;
