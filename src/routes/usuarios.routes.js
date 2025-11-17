// src/routes/usuarios.routes.js
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

// PRUEBA
router.get("/prueba", pruebaUsuarios);

// ADMIN ve todos
router.get("/usuarios", verifyToken, verifyRole([1]), getUsuarios);

// ADMIN y el mismo usuario pueden ver por ID (más adelante puedo mejorar esto)
router.get("/usuarios/:id", verifyToken, getUsuarioxId);

// ADMIN crea usuarios
router.post("/usuarios", verifyToken, verifyRole([1]), postUsuario);

// ADMIN edita
router.put("/usuarios/:id", verifyToken, verifyRole([1]), putUsuario);

// ADMIN elimina
router.delete("/usuarios/:id", verifyToken, verifyRole([1]), deleteUsuario);

export default router;
