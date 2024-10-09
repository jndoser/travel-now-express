require("dotenv").config();
import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/prisma-client";

export const protectData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if the authorization header exists and starts with "Bearer "
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      // Extract the token from the authorization header
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(401).json({ message: "Missing token" });
      }

      // Verify the token
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      // Fetch the user from the database using Prisma
      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.user.userId, // Assuming the token contains the user's id
        },
      });

      // Check if the user exists
      if (!user) {
        res.status(401).json({ message: "User not found" });
      }

      // Attach the user to the request object for future middleware or route handlers
      req.user = user;

      // Call the next middleware
      next();
    } else {
      // If no token is provided, return an error
      res.status(401).json({ message: "Authorization token missing" });
    }
  } catch (error) {
    // Handle errors such as invalid tokens or any other error during the process
    res.status(401).json({ message: "Invalid token" });
  }
};
