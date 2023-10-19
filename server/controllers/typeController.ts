import { Request, Response } from "express";

class TypeController {
  async create(req: Request, resp: Response) {
    resp.json({ message: "create" })
  }
  async getAll(req: Request, resp: Response) {
    resp.json({ message: "getAll" })
  }
}

export default new TypeController();