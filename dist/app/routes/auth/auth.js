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
exports.protectData = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = __importDefault(require("../../../prisma/prisma-client"));
const protectData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the authorization header exists and starts with "Bearer "
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")) {
            // Extract the token from the authorization header
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Missing token" });
            }
            // Verify the token
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
            // Fetch the user from the database using Prisma
            const user = yield prisma_client_1.default.user.findUnique({
                where: {
                    id: decodedToken.id, // Assuming the token contains the user's id
                },
            });
            // Check if the user exists
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            // Attach the user to the request object for future middleware or route handlers
            req.user = user;
            // Call the next middleware
            return next();
        }
        else {
            // If no token is provided, return an error
            return res.status(401).json({ message: "Authorization token missing" });
        }
    }
    catch (error) {
        // Handle errors such as invalid tokens or any other error during the process
        return res.status(401).json({ message: "Invalid token" });
    }
});
exports.protectData = protectData;
