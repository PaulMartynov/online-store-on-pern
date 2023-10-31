import { Router } from "express";
import typeController from "../controllers/typeController";

const router = Router();

router.post("/", typeController.create);
router.get("/", typeController.getAll);
router.delete("/:id", typeController.remove);
router.put("/:id", typeController.update);

export default router;
