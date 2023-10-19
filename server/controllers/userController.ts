import { Request, Response } from "express";

class UserController {
  async registration(req: Request, resp: Response) {
    resp.json({ message: "Regist" })
  }
  async login(req: Request, resp: Response) {
    resp.json({ message: "Login" })
  }
  async check(req: Request, resp: Response) {
    resp.json({ message: "AUTH" })
  }
}

export default new UserController();