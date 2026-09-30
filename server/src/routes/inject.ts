import { Router } from "express";
import { handleLogInjection } from "../controllers/injectionController.js";

const router = Router();

router.post("/stream/inject",handleLogInjection);

export default router;