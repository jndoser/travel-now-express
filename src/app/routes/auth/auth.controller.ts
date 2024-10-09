import { NextFunction, Request, Response, Router } from "express";
import { createUser, getCurrentUser, login } from "./auth.service";
import { protectData } from "./auth";

const router = Router();

router.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await createUser({ ...req.body });
      res.status(201).json({ user });
    } catch (error: any) {
      res.status(error.errorCode).json({ message: error.message });
    }
  }
);

router.post(
  "/users/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login({ ...req.body });
      res.json({ user });
    } catch (error: any) {
      res.status(error.errorCode).json({ message: error.message });
    }
  }
);

router.get(
  "/user",
  protectData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getCurrentUser(req.user.id);
      res.json({ user });
    } catch (error: any) {
      res.status(error.errorCode).json({ message: error.message });
    }
  }
);

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

export default router;
