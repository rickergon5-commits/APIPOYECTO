// src/routes/auth.routes.js
import { Router } from "express";
import { register, login, registerMedico } from "../controladores/authCtrl.js";
import { uploadPDF } from "../middlewares/upload.js"; // 👈 de tu upload.js

const router = Router();

// REGISTRO PACIENTE
router.post("/register", register);

// REGISTRO MÉDICO (con PDF)
router.post(
  "/register-medico",
  uploadPDF.single("documento_adjunto"), // campo del archivo
  registerMedico
);

// LOGIN
router.post("/login", login);

export default router;
