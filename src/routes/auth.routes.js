import { Router } from "express";
import { register, login } from "../controladores/authCtrl.js";

const router = Router();

// REGISTRO
router.post("/register", register);

// LOGIN
router.post("/login", login);

export default router;
