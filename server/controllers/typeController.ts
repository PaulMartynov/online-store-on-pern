import { NextFunction, Request, Response } from "express";
import models from "../models/models";
import ApiError from "../error/ApiError";

class TypeController {
  async create(req: Request, resp: Response, next: NextFunction) {
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest("Uncorrect type name"));
    }

    const exType = await models.Type.findOne({ where: { name } });
    if (exType) {
      return next(ApiError.badRequest(`Type '${name}' already exist`));
    }

    const pType = await models.Type.create({ name });
    resp.json(pType);
  }
  async getAll(req: Request, resp: Response) {
    const types = await models.Type.findAll();
    resp.json(types);
  }
}

export default new TypeController();
