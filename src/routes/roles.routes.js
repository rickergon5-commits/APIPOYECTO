import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaRoles,
  getRoles,
  getRolxId,
  postRol,
  putRol,
  deleteRol
} from "../controladores/rolesCtrl.js";

const router = Router();

router.get("/prueba", pruebaRoles);

router.get("/roles", verifyToken, getRoles);
router.get("/roles/:id", verifyToken, getRolxId);
router.post("/roles", verifyToken, postRol);
router.put("/roles/:id", verifyToken, putRol);
router.delete("/roles/:id", verifyToken, deleteRol);

export default router;
