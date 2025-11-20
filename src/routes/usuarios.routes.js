import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

import {
  pruebaUsuarios,
  getUsuarios,
  getUsuarioxId,
  postUsuario,
  putUsuario,
  deleteUsuario
} from "../controladores/usuariosCtrl.js";

const router = Router();

router.get("/prueba", pruebaUsuarios);

router.get("/usuarios", verifyToken, verifyRole([1]), getUsuarios);

router.get("/usuarios/:id", verifyToken, getUsuarioxId);

router.post("/usuarios", verifyToken, verifyRole([1]), postUsuario);

router.put("/usuarios/:id", verifyToken, verifyRole([1]), putUsuario);

router.delete("/usuarios/:id", verifyToken, verifyRole([1]), deleteUsuario);

export default router;
