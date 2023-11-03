import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import ApiError from "../error/ApiError";
import models from "../models/models";

interface User {
  id: number;
  email: string;
  password: string;
  roles: string;
}

interface UserRequest extends Request {
  user: User;
}

const generateToken = (id: number, email: string, roles: string) => {
  return jwt.sign({ id, email, roles }, process.env.SECRET_KEY as Secret, {
    expiresIn: "3h",
  });
};

class UserController {
  async registration(req: Request, resp: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Uncorrect email or password"));
    }

    try {
      const existUser = await models.User.findOne({ where: { email } });

      if (existUser) {
        return next(
          ApiError.badRequest(`User with email: ${email}, already exist`),
        );
      }

      const hashPasswd = await bcrypt.hash(password, 5);
      const user = (await models.User.create({
        email,
        password: hashPasswd,
        roles: "USER",
      })) as unknown as User;
      await models.Cart.create({ userId: user.id });
      const token = generateToken(user.id, user.email, user.roles);

      return resp.json({ token });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest("Uncorrect email or password"));
    }
    try {
      const user = (await models.User.findOne({
        where: { email },
      })) as unknown as User;

      if (!user) {
        return next(ApiError.badRequest("User not exist"));
      }

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return next(ApiError.badRequest("Uncorrect password"));
      }

      const token = generateToken(user.id, user.email, user.roles);

      return resp.json({ token });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
  }

  async check(req: Request, resp: Response, next: NextFunction) {
    const { id, email, roles } = req.query;
    if (!id || !email || !roles) {
      return next(ApiError.badRequest(`Uncorrect query parameters`));
    }
    const token = generateToken(Number(id), email as string, roles as string);
    return resp.json({ token });
  }

  async remove(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect type id"));
    }
    try {
      await models.User.destroy({ where: { id } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }

    resp.status(200).json({ id });
  }

  async update(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.query;
    if (!id) {
      return next(ApiError.badRequest("Uncorrect user id"));
    }
    resp.status(200).json({ id });

    const { email, password, roles } = req.body;
    if (!password && !email && !roles) {
      return next(ApiError.badRequest(`Uncorrect query parameters`));
    }

    try {
      const user = (await models.User.findOne({
        where: { email },
      })) as unknown as User;

      if (!user) {
        return next(ApiError.badRequest("User not exist"));
      }

      const userParams: { [key: string]: unknown } = {};

      if (email) {
        userParams.email = email;
      }

      if (password) {
        if (
          Number(id) !== user.id &&
          !(req as UserRequest).user?.roles.includes("ADMIN")
        ) {
          return next(ApiError.forbidden("No access to change password"));
        }
        const hashPasswd = await bcrypt.hash(password, 5);
        userParams.password = hashPasswd;
      }

      if (roles) {
        if (!(req as UserRequest).user?.roles.includes("ADMIN")) {
          return next(ApiError.forbidden("No privilege to change roles"));
        }
        userParams.roles = roles;
      }

      (await models.User.update(userParams, {
        where: { id: user.id },
      })) as unknown as User;

      return resp.status(200).json({ id });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new UserController();
