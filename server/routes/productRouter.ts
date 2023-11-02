import { Router } from "express";
import productController from "../controllers/productController";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

router.post("/", checkRoleMiddleware("ADMIN"), productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
router.delete("/:id", checkRoleMiddleware("ADMIN"), productController.remove);
router.put("/:id", checkRoleMiddleware("ADMIN"), productController.update);
router.patch("/:id", checkRoleMiddleware("ADMIN"), productController.patch);

export default router;
