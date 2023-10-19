import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";

class UserController {
  async registration(req: Request, resp: Response) {
    resp.json({ message: "Regist" })
  }
  async login(req: Request, resp: Response) {
    resp.json({ message: "Login" })
  }
  async check(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.query;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect user id"))
    }
    resp.status(200).json({ id });
  }
}

export default new UserController();