import { Router } from "express";
import brandController from "../controllers/brandController";

const router = Router();

router.post("/", brandController.create);
router.get("/", brandController.getAll);
router.delete("/:id", brandController.remove);
router.put("/:id", brandController.update);

export default router;
