import { Router } from "express";
import typeController from "../controllers/typeController";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

router.post("/", checkRoleMiddleware("ADMIN"), typeController.create);
router.get("/", typeController.getAll);
router.delete("/:id", checkRoleMiddleware("ADMIN"), typeController.remove);
router.put("/:id", checkRoleMiddleware("ADMIN"), typeController.update);

export default router;
