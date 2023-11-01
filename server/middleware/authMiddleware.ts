/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface UserRequest extends Request {
  user: unknown;
}

export default function (req: Request, res: Response, next: NextFunction) {
  console.log("!!!!");
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization!.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY as Secret);
    (req as UserRequest).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
}
