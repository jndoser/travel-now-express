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
const auth_service_1 = require("./auth.service");
const auth_1 = require("./auth");
const router = (0, express_1.Router)();
router.post("/users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("user", req.body);
        const user = yield (0, auth_service_1.createUser)(Object.assign({}, req.body));
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
}));
router.post("/users/login", auth_1.protectData, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.login)(Object.assign({}, req.body));
        res.json({ user });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}));
router.get("/user", auth_1.protectData, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user = await getCurrentUser(req.auth?.user?.id);
        res.json({});
    }
    catch (error) {
        next(error);
    }
}));
// router.put(
//   "/user",
//   auth.required,
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = await updateUser(req.body.user, req.auth?.user?.id);
//       res.json({ user });
//     } catch (error) {
//       next(error);
//     }
//   }
// );
exports.default = router;
