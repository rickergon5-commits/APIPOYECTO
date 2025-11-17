// routes/predicciones.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaPredicciones,
  getPredicciones,
  getPrediccionesPorPlan,
  getPrediccionxId,
  postPrediccion,
  putPrediccion,
  deletePrediccion
} from "../controladores/prediccionesCtrl.js";

const router = Router();

router.get("/prueba", pruebaPredicciones);

router.get("/predicciones", verifyToken, getPredicciones);
router.get("/predicciones/plan/:plan_habito_id", verifyToken, getPrediccionesPorPlan);
router.get("/predicciones/:id", verifyToken, getPrediccionxId);
router.post("/predicciones", verifyToken, postPrediccion);
router.put("/predicciones/:id", verifyToken, putPrediccion);
router.delete("/predicciones/:id", verifyToken, deletePrediccion);

export default router;
