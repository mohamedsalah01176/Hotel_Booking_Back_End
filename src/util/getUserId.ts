import { Request } from "express";


export const getUserId = (req: Request): string => {
  const user = req.user;

  if (!user || typeof user === "string") {
    throw new Error("Authenticated user ID not found");
  }

  const userId = user._id;

  if (!userId) {
    throw new Error("Authenticated user ID not found");
  }

  return userId.toString();
};