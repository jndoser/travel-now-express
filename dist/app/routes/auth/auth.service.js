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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getCurrentUser = exports.login = exports.createUser = void 0;
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const http_exception_model_1 = __importDefault(require("../../models/http-exception.model"));
const token_utils_1 = require("./token.utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = (userInputData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const email = (_a = userInputData.email) === null || _a === void 0 ? void 0 : _a.trim();
    const username = (_b = userInputData.username) === null || _b === void 0 ? void 0 : _b.trim();
    const password = (_c = userInputData.password) === null || _c === void 0 ? void 0 : _c.trim();
    if (!email) {
        throw new http_exception_model_1.default(422, { errors: { email: ["can't be blank"] } });
    }
    if (!username) {
        throw new http_exception_model_1.default(422, { errors: { username: ["can't be blank"] } });
    }
    if (!password) {
        throw new http_exception_model_1.default(422, { errors: { password: ["can't be blank"] } });
    }
    const existingUserByEmail = yield prisma_client_1.default.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    const existingUserByUsername = yield prisma_client_1.default.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        },
    });
    if (existingUserByEmail || existingUserByUsername) {
        throw new http_exception_model_1.default(422, {
            errors: Object.assign(Object.assign({}, (existingUserByEmail ? { email: ["has already been taken"] } : {})), (existingUserByUsername
                ? { username: ["has already been taken"] }
                : {})),
        });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const { id } = yield prisma_client_1.default.user.create({
        data: {
            firstName: userInputData.firstName,
            lastName: userInputData.lastName,
            sex: userInputData.sex,
            age: userInputData.age,
            address: userInputData.address,
            phoneNumber: userInputData.phoneNumber,
            email: userInputData.email,
            username: userInputData.username,
            password: hashedPassword,
            role: "user",
        },
    });
    return {
        userId: id,
        token: (0, token_utils_1.generateToken)(id),
    };
});
exports.createUser = createUser;
const login = (userInputData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = (_a = userInputData.username) === null || _a === void 0 ? void 0 : _a.trim();
    const password = (_b = userInputData.password) === null || _b === void 0 ? void 0 : _b.trim();
    if (!email) {
        throw new http_exception_model_1.default(422, { errors: { email: ["can't be blank"] } });
    }
    if (!password) {
        throw new http_exception_model_1.default(422, { errors: { password: ["can't be blank"] } });
    }
    const user = yield prisma_client_1.default.user.findUnique({
        where: {
            email,
        },
    });
    try {
        if (user) {
            const match = yield bcryptjs_1.default.compare(password, user.password);
            if (match) {
                const { password } = user, returnData = __rest(user, ["password"]);
                return {
                    user: returnData,
                    token: (0, token_utils_1.generateToken)(user.id),
                };
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const getCurrentUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_client_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new http_exception_model_1.default(404, {
            errors: {
                user: ["is not exist"],
            },
        });
    }
    const { password } = user, returnData = __rest(user, ["password"]);
    return {
        user: returnData,
        token: (0, token_utils_1.generateToken)(user.id),
    };
});
exports.getCurrentUser = getCurrentUser;
const updateUser = (userDataToUpdate, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, sex, age, address, phoneNumber, email, username, password, } = userDataToUpdate;
    let hashedPassword;
    if (password) {
        hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    }
    const updatedUser = yield prisma_client_1.default.user.update({
        where: {
            id: userId,
        },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (firstName ? { firstName } : {})), (lastName ? { lastName } : {})), (sex ? { sex } : {})), (age ? { age } : {})), (address ? { address } : {})), (phoneNumber ? { phoneNumber } : {})), (email ? { email } : {})), (username ? { username } : {})), (password ? { password: hashedPassword } : {})),
        select: {
            id: true,
            firstName: true,
            lastName: true,
            sex: true,
            age: true,
            address: true,
            phoneNumber: true,
            email: true,
            username: true,
        },
    });
    return {
        user: updatedUser,
        token: (0, token_utils_1.generateToken)(updatedUser.id),
    };
});
exports.updateUser = updateUser;
