import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaPlanHabitos,
  getPlanesHabitos,
  getPlanesPorUsuario,
  getPlanHabitoxId,
  postPlanHabito,
  putPlanHabito,
  deletePlanHabito
} from "../controladores/planHabitosCtrl.js";

const router = Router();

router.get("/prueba", pruebaPlanHabitos);

router.get("/planHabitos", verifyToken, getPlanesHabitos);
router.get("/planHabitos/usuario/:usuario_id", verifyToken, getPlanesPorUsuario);
router.get("/planHabitos/:id", verifyToken, getPlanHabitoxId);
router.post("/planHabitos", verifyToken, postPlanHabito);
router.put("/planHabitos/:id", verifyToken, putPlanHabito);
router.delete("/planHabitos/:id", verifyToken, deletePlanHabito);

export default router;
