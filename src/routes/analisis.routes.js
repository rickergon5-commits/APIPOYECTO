// routes/analisis.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaAnalisis,
  getAnalisis,
  getAnalisisPorRegistro,
  getAnalisisxId,
  postAnalisis,
  putAnalisis,
  deleteAnalisis
} from "../controladores/analisisCtrl.js";

const router = Router();

router.get("/prueba", pruebaAnalisis);

router.get("/analisis", verifyToken, getAnalisis);
router.get("/analisis/registro/:registro_id", verifyToken, getAnalisisPorRegistro);
router.get("/analisis/:id", verifyToken, getAnalisisxId);
router.post("/analisis", verifyToken, postAnalisis);
router.put("/analisis/:id", verifyToken, putAnalisis);
router.delete("/analisis/:id", verifyToken, deleteAnalisis);

export default router;
