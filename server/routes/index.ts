import { Router } from "express";
import BrandRouter from "./brandRouter";
import ProductRouter from "./productRouter";
import TypeRouter from "./typeRouter";
import UserRouter from "./userRouter";

const router = Router();

router.use("/brand", BrandRouter);
router.use("/product", ProductRouter);
router.use("/type", TypeRouter);
router.use("/user", UserRouter);

export default router;
