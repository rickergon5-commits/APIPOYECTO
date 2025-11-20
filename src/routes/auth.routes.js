import { Router } from "express";
import { register, login, registerMedico } from "../controladores/authCtrl.js";
import { uploadPDF } from "../middlewares/upload.js"; 

const router = Router();

router.post("/register", register);

router.post(
  "/register-medico",
  uploadPDF.single("documento_adjunto"), 
  registerMedico
);

router.post("/login", login);

export default router;
