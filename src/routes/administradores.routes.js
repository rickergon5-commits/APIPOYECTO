// routes/administradores.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaAdmins,
  getAdministradores,
  getAdministradorxId,
  postAdministrador,
  putAdministrador,
  deleteAdministrador
} from "../controladores/administradoresCtrl.js";

const router = Router();

router.get("/prueba", pruebaAdmins);

router.get("/administradores", verifyToken, getAdministradores);
router.get("/administradores/:id", verifyToken, getAdministradorxId);
router.post("/administradores", verifyToken, postAdministrador);
router.put("/administradores/:id", verifyToken, putAdministrador);
router.delete("/administradores/:id", verifyToken, deleteAdministrador);

export default router;
