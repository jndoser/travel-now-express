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
const user_service_1 = require("./user.service");
const router = (0, express_1.Router)();
router.get("/user/saved-rooms/:clerkId", (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const savedRooms = yield (0, user_service_1.getSavedRoomsByUser)({
        clerkId: req.params.clerkId,
        page,
        limit,
    });
    response.status(200).json(Object.assign({}, savedRooms));
}));
router.get("/user/:clerkId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield (0, user_service_1.getUserInfoByClerkId)(req.params.clerkId);
    res.status(200).json(userInfo);
}));
exports.default = router;
