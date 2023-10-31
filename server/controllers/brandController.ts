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
    await models.Brand.destroy({ where: { id }});
    resp.status(200).json({ id });
  }
}

export default new BrandController();
