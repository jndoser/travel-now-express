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
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const uploadImage = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = yield file.buffer;
    const bytes = Buffer.from(buffer);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        cloudinary_1.default.v2.config({
            cloud_name: "de3myhvle",
            api_key: "519859121153722",
            api_secret: process.env.CLOUDINARY_SECRET_API,
        });
        yield cloudinary_1.default.v2.uploader
            .upload_stream({
            resource_type: "auto",
            folder: folder,
        }, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject(err.message);
            }
            resolve(result);
        }))
            .end(bytes);
    }));
});
exports.uploadImage = uploadImage;
const deleteImage = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            cloudinary_1.default.v2.config({
                cloud_name: "de3myhvle",
                api_key: "519859121153722",
                api_secret: process.env.CLOUDINARY_SECRET_API,
            });
            const result = yield cloudinary_1.default.v2.uploader.destroy(public_id);
            resolve(result);
        }
        catch (error) {
            reject(new Error(error.message));
        }
    }));
});
exports.deleteImage = deleteImage;
