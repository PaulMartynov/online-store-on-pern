import { NextFunction, Request, Response } from "express";
import models from "../models/models";
import ApiError from "../error/ApiError";

class BrandController {
  async create(req: Request, resp: Response, next: NextFunction) {
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest("Uncorrect brand name"));
    }

    const exBrand = await models.Brand.findOne({ where: { name } });
    if (exBrand) {
      return next(ApiError.badRequest(`Brand '${name}' already exist`));
    }

    const newBrand = await models.Brand.create({ name });
    resp.json(newBrand);
  }

  async getAll(req: Request, resp: Response) {
    const brands = await models.Brand.findAll();
    resp.json(brands);
  }

  async remove(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect brand id"));
    }
    try {
      await models.Brand.destroy({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return next(ApiError.internal(e.message));
    }

    resp.status(200).json({ id });
  }

  async update(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect brand id"));
    }
    const { name } = req.body;
    if (!name) {
      return next(ApiError.badRequest("Uncorrect brand name"));
    }

    try {
      await models.Brand.update({ name }, { where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
    resp.status(200).json({ id, name });
  }
}

export default new BrandController();
