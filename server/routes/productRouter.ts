import { Router } from "express";
import productController from "../controllers/productController";

const router = Router();

router.post("/", productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.delete("/:id", productController.remove);
router.put("/:id", productController.update);
router.patch("/:id", productController.patch);

export default router;
