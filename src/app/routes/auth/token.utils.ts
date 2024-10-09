import * as jwt from "jsonwebtoken";

export const generateToken = (userId: string): string =>
  jwt.sign({ user: { userId } }, process.env.JWT_SECRET || "superSecret", {
    expiresIn: "1d",
  });
