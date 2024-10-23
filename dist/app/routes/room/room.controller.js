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
const room_service_1 = require("./room.service");
const router = (0, express_1.Router)();
router.post("/room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, room_service_1.createRoom)(Object.assign({}, req.body));
        res.status(201).json(id);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const searchKeywords = req.query.searchKeywords;
        const clerkId = req.query.clerkId;
        const status = req.query.status;
        const getRoomData = {
            page,
            limit,
            searchKeywords,
            clerkId,
            status,
        };
        const rooms = yield (0, room_service_1.getRooms)(getRoomData);
        res.json(rooms);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/room/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield (0, room_service_1.getRoomById)(req.params.roomId);
        res.json(room);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
router.put("/room/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield (0, room_service_1.updateRoom)(req.params.roomId, Object.assign({}, req.body));
        res.status(200).json(room);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
router.delete("/room/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, room_service_1.deleteRoom)(req.params.roomId);
        res.json(id);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
router.put("/room/save/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const savedRoom = yield (0, room_service_1.saveRoom)({
        roomId: req.params.roomId,
        clerkId: req.body.clerkId,
    });
    res.status(200).json(savedRoom);
}));
router.put("/room/unsave/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const unsavedRoom = yield (0, room_service_1.unsaveRoom)({
        roomId: req.params.roomId,
        clerkId: req.body.clerkId,
    });
    res.status(200).json(unsavedRoom);
}));
router.put("/room/approve/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const approvedRoom = yield (0, room_service_1.approveRoom)(req.params.roomId);
    res.status(200).json(approvedRoom);
}));
router.put("/room/reject/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rejectedRoom = yield (0, room_service_1.rejectRoom)(req.params.roomId);
    res.status(200).json(rejectedRoom);
}));
exports.default = router;
