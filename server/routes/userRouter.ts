import { Router } from "express";


const router = Router();

router.post("/registration")
router.post("/login")
router.get("/auth", (req, resp) => {
  resp.json({ message: "AUTH" })
})


export default router;