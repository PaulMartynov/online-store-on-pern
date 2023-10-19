import { Request, Response } from "express";

class PropductController {
  async create(req: Request, resp: Response) {
    resp.json({ message: "create" })
  }
  async getAll(req: Request, resp: Response) {
    resp.json({ message: "getAll" })
  }
  async getOne(req: Request, resp: Response) {
    resp.json({ message: "getOne" })
  }
}

export default new PropductController();