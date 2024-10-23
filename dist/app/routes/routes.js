"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../routes/user/user.controller"));
const room_controller_1 = __importDefault(require("../routes/room/room.controller"));
const room_service_controller_1 = __importDefault(require("../routes/room-service/room-service.controller"));
const room_feedback_controller_1 = __importDefault(require("../routes/room-feedback/room-feedback.controller"));
const images_controller_1 = __importDefault(require("../routes/images/images.controller"));
const webhook_controller_1 = __importDefault(require("../routes/webhook/webhook.controller"));
const room_booking_controller_1 = __importDefault(require("../routes/room-booking/room-booking.controller"));
const api = (0, express_1.Router)()
    .use(user_controller_1.default)
    .use(room_controller_1.default)
    .use(room_service_controller_1.default)
    .use(room_feedback_controller_1.default)
    .use(images_controller_1.default)
    .use(webhook_controller_1.default)
    .use(room_booking_controller_1.default);
exports.default = (0, express_1.Router)().use("/api", api);
