// src/routes/pacientes.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

import {
  pruebaPacientes,
  getPacientes,
  getPacientexId,
  deletePaciente
} from "../controladores/pacientesCtrl.js";

const router = Router();

router.get("/pacientes/prueba", pruebaPacientes);

// SOLO ADMIN (rol_id = 1)
router.get("/usuarios/pacientes", verifyToken, verifyRole([1]), getPacientes);
router.get("/usuarios/pacientes/:id", verifyToken, verifyRole([1]), getPacientexId);
router.delete("/usuarios/pacientes/:id", verifyToken, verifyRole([1]), deletePaciente);

export default router;
