import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaCumplimiento,
  getRegistrosCumplimiento,
  getCumplimientoPorPlan,
  getCumplimientoxId,
  postCumplimiento,
  putCumplimiento,
  deleteCumplimiento
} from "../controladores/cumplimientoCtrl.js";

const router = Router();

router.get("/prueba", pruebaCumplimiento);

router.get("/cumplimiento", verifyToken, getRegistrosCumplimiento);
router.get("/cumplimiento/plan/:plan_habito_id", verifyToken, getCumplimientoPorPlan);
router.get("/cumplimiento/:id", verifyToken, getCumplimientoxId);
router.post("/cumplimiento", verifyToken, postCumplimiento);
router.put("/cumplimiento/:id", verifyToken, putCumplimiento);
router.delete("/cumplimiento/:id", verifyToken, deleteCumplimiento);

export default router;
