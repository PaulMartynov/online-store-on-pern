import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", userController.check);
router.delete("/:id", userController.remove);
router.patch("/:id", userController.update);

export default router;
