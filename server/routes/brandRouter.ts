import { Router } from "express";
import brandController from "../controllers/brandController";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

router.post("/", checkRoleMiddleware("ADMIN"), brandController.create);
router.get("/", brandController.getAll);
router.delete("/:id", checkRoleMiddleware("ADMIN"), brandController.remove);
router.put("/:id", checkRoleMiddleware("ADMIN"), brandController.update);

export default router;
