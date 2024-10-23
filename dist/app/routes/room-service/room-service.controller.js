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
const room_service_service_1 = require("./room-service.service");
const router = (0, express_1.Router)();
router.get("/services", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield (0, room_service_service_1.getServices)();
    res.json(services);
}));
router.get("/services/:serviceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield (0, room_service_service_1.getServiceById)(req.params.serviceId);
    res.json(service);
}));
router.post("/services", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newService = yield (0, room_service_service_1.createService)(Object.assign({}, req.body));
        res.json(newService);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
router.put("/services/:serviceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedService = yield (0, room_service_service_1.updateService)(req.params.serviceId, Object.assign({}, req.body));
        res.json(updatedService);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
router.delete("/services/:serviceId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, room_service_service_1.deleteService)(req.params.serviceId);
        res.json(id);
    }
    catch (error) {
        res.status(error.errorCode).json({ message: error.message });
    }
}));
exports.default = router;
