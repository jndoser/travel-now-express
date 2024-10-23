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
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getServices = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const getServices = () => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield prisma_client_1.default.service.findMany({});
    return services;
});
exports.getServices = getServices;
const getServiceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield prisma_client_1.default.service.findUnique({
        where: {
            id,
        },
    });
    return service;
});
exports.getServiceById = getServiceById;
const createService = (createServiceData) => __awaiter(void 0, void 0, void 0, function* () {
    const title = createServiceData.title.trim();
    const existingService = yield prisma_client_1.default.service.findUnique({
        where: {
            title,
        },
    });
    if (existingService) {
        throw new http_exception_model_1.default(401, "This service is already exist. Please choose another name");
    }
    const newService = yield prisma_client_1.default.service.create({
        data: Object.assign({ title }, (createServiceData.imageUrl
            ? { imageUrl: createServiceData.imageUrl }
            : {})),
    });
    return newService;
});
exports.createService = createService;
const updateService = (id, updateServiceData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, "Please provide the service id");
    }
    const updatedService = yield prisma_client_1.default.service.update({
        where: {
            id,
        },
        data: Object.assign({ title: updateServiceData.title }, (updateServiceData.imageUrl
            ? { imageUrl: updateServiceData.imageUrl }
            : {})),
        select: {
            title: true,
            imageUrl: true,
        },
    });
    return updatedService;
});
exports.updateService = updateService;
const deleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new http_exception_model_1.default(401, "Please provide the room id");
    }
    const { id: serviceId } = yield prisma_client_1.default.service.delete({
        where: {
            id,
        },
    });
    return serviceId;
});
exports.deleteService = deleteService;
