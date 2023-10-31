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

  async remove(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect type id"));
    }
    try {
      await models.Type.destroy({ where: { id }});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
    resp.status(200).json({ id });
  }

  async update(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect type id"));
    }
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest("Uncorrect type name"));
    }

    try {
      await models.Type.update({ name }, { where: { id }});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
    resp.status(200).json({ id, name });
  }
}

export default new TypeController();
