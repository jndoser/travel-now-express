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
const room_feedback_service_1 = require("./room-feedback.service");
const router = (0, express_1.Router)();
router.get("/room-feedbacks/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const getFeedbacksByRoomData = {
            page,
            limit,
            roomId: req.params.roomId,
        };
        const feedbacks = yield (0, room_feedback_service_1.getFeedbackFromRoom)(getFeedbacksByRoomData);
        res.json(feedbacks);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
router.post("/room-feedbacks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newFeedback = yield (0, room_feedback_service_1.createFeedback)(Object.assign({}, req.body));
    res.status(201).json(newFeedback);
}));
exports.default = router;
