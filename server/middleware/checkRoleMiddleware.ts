/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface UserRequest extends Request {
  user: unknown;
}

interface JWTPayloadExt extends jwt.JwtPayload {
  roles: string;
}

export default function (role: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY as Secret,
      ) as unknown as JWTPayloadExt;
      if (!decoded.roles.includes(role)) {
        return res.status(403).json({ message: "No access" });
      }
      (req as UserRequest).user = decoded;
      next();
    } catch {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
}
