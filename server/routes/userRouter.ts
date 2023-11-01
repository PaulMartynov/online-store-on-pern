import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.delete("/:id", authMiddleware, userController.remove);
router.patch("/:id", authMiddleware, userController.update);

export default router;
