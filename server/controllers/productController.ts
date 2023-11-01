import { Request, Response, NextFunction } from "express";
import { FileArray, UploadedFile } from "express-fileupload";
import path from "path";
import uuid from "uuid";
import models from "../models/models";
import ApiError from "../error/ApiError";

interface ProductInfoType {
  title: string;
  description: string;
  id: number;
}

class PropductController {
  async create(req: Request, resp: Response, next: NextFunction) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files as FileArray;

      if (!name || !price || !brandId || !typeId || !info || !img) {
        return next(
          ApiError.badRequest(
            "Need all the parameters: name, price, brandId, typeId, info, img",
          ),
        );
      }

      const fileName = `${uuid.v4()}.jpg`;
      (img as UploadedFile).mv(
        path.resolve(__dirname, "..", "static", fileName),
      );
      const product = (await models.Product.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      })) as unknown as ProductInfoType;

      if (info) {
        const pinfo = JSON.parse(info);
        pinfo.forEach((i: ProductInfoType) =>
          models.ProductInfo.create({
            title: i.title,
            description: i.description,
            deviceId: product.id,
          }),
        );
      }

      return resp.json(product);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req: Request, resp: Response) {
    const { brandId, typeId, limit, page } = req.query;
    const pPage = Number(page || 1);
    const plimit = Number(limit || 9);
    const offset = pPage * plimit - plimit;
    let product;
    if (!brandId && !typeId) {
      product = await models.Product.findAndCountAll({ limit: plimit, offset });
    }
    if (brandId && !typeId) {
      product = await models.Product.findAndCountAll({
        where: { brandId },
        limit: plimit,
        offset,
      });
    }
    if (!brandId && typeId) {
      product = await models.Product.findAndCountAll({
        where: { typeId },
        limit: plimit,
        offset,
      });
    }
    if (brandId && typeId) {
      product = await models.Product.findAndCountAll({
        where: { typeId, brandId },
        limit: plimit,
        offset,
      });
    }
    return resp.json(product);
  }

  async getOne(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      if (!id) {
        return next(ApiError.badRequest("Uncorrect product id"));
      }
    }
    const product = await models.Product.findOne({
      where: { id },
      include: [{ model: models.ProductInfo, as: "info" }],
    });
    resp.json(product);
  }

  async remove(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect product id"));
    }
    try {
      await models.Product.destroy({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }

    resp.status(200).json({ id });
  }

  async update(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect product id"));
    }

    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files as FileArray;

      if (!name || !price || !brandId || !typeId || !info || !img) {
        return next(
          ApiError.badRequest(
            "Need all the parameters: name, price, brandId, typeId, info, img",
          ),
        );
      }

      const fileName = `${uuid.v4()}.jpg`;
      (img as UploadedFile).mv(
        path.resolve(__dirname, "..", "static", fileName),
      );

      const product = (await models.Product.update(
        {
          name,
          price,
          brandId,
          typeId,
          img: fileName,
        },
        { where: { id } },
      )) as unknown as ProductInfoType;

      if (info) {
        const pinfo = JSON.parse(info);
        pinfo.forEach((i: ProductInfoType) => {
          if (i.id) {
            models.ProductInfo.update(
              {
                title: i.title,
                description: i.description,
                deviceId: product.id,
              },
              { where: { deviceId: product.id, id: i.id } },
            );
          } else {
            models.ProductInfo.create({
              title: i.title,
              description: i.description,
              deviceId: product.id,
            });
          }
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
    resp.status(200).json({ id });
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect product id"));
    }

    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files as FileArray;

      const productData: { [key: string]: unknown } = {};

      if (img) {
        const fileName = `${uuid.v4()}.jpg`;
        (img as UploadedFile).mv(
          path.resolve(__dirname, "..", "static", fileName),
        );

        productData.img = fileName;
      }

      if (name) {
        productData.name = name;
      }

      if (price !== undefined) {
        productData.price = price;
      }

      if (brandId) {
        productData.brandId = brandId;
      }

      if (typeId) {
        productData.typeId = typeId;
      }

      const product = (await models.Product.update(productData, {
        where: { id },
      })) as unknown as ProductInfoType;

      if (info) {
        const pinfo = JSON.parse(info);
        pinfo.forEach((i: ProductInfoType) => {
          if (i.id) {
            models.ProductInfo.update(
              {
                title: i.title,
                description: i.description,
                deviceId: product.id,
              },
              { where: { deviceId: product.id, id: i.id } },
            );
          } else {
            models.ProductInfo.create({
              title: i.title,
              description: i.description,
              deviceId: product.id,
            });
          }
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
    resp.status(200).json({ id });
  }
}

export default new PropductController();
