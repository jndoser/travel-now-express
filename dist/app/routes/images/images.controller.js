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
const express_1 = require("express");
const cloudinary_1 = require("../../libs/cloudinary");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post("/images/upload", upload.array("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formDataEntryValues = Array.from(req.files);
    const responseData = [];
    for (const formDataEntryValue of formDataEntryValues) {
        const data = (yield (0, cloudinary_1.uploadImage)(formDataEntryValue, "vue-travel-now"));
        responseData.push({
            display_name: data.display_name,
            public_id: data.public_id,
            url: data.url,
        });
    }
    res.status(201).json({ responseData });
}));
router.delete("/images/upload/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deleteResult = yield (0, cloudinary_1.deleteImage)("vue-travel-now/" + id);
    res.status(201).json({ deleteResult });
}));
exports.default = router;
