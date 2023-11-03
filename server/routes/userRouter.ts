import { Router } from "express";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.delete("/:id", checkRoleMiddleware("ADMIN"), userController.remove);
router.patch("/:id", authMiddleware, userController.update);

export default router;
