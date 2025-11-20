import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadPDF } from "../middlewares/upload.js"; // 👈 AÑADIDO

import {
  pruebaMedicos,
  getMedicos,
  getMedicoxId,
  postMedico,
  putMedico,
  deleteMedico
} from "../controladores/medicosCtrl.js";

const router = Router();

router.get("/prueba", pruebaMedicos);

router.get("/medicos", verifyToken, getMedicos);
router.get("/medicos/:id", verifyToken, getMedicoxId);

router.post(
  "/medicos",
  verifyToken,
  uploadPDF.single("documento_certificacion"),
  postMedico
);

router.put(
  "/medicos/:id",
  verifyToken,
  uploadPDF.single("documento_certificacion"),
  putMedico
);

router.delete("/medicos/:id", verifyToken, deleteMedico);

export default router;
