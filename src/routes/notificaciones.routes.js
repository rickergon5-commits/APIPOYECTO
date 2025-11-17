// routes/notificaciones.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaNotificaciones,
  getNotificaciones,
  getNotificacionesPorUsuario,
  getNotificacionxId,
  postNotificacion,
  putNotificacion,
  deleteNotificacion
} from "../controladores/notificacionesCtrl.js";

const router = Router();

router.get("/prueba", pruebaNotificaciones);

router.get("/notificaciones", verifyToken, getNotificaciones);
router.get("/notificaciones/usuario/:usuario_id", verifyToken, getNotificacionesPorUsuario);
router.get("/notificaciones/:id", verifyToken, getNotificacionxId);
router.post("/notificaciones", verifyToken, postNotificacion);
router.put("/notificaciones/:id", verifyToken, putNotificacion);
router.delete("/notificaciones/:id", verifyToken, deleteNotificacion);

export default router;
