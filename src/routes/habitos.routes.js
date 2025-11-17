// routes/habitos.routes.js
import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import {
  pruebaHabitos,
  getHabitos,
  getHabitoxId,
  postHabito,
  putHabito,
  deleteHabito
} from "../controladores/habitosCtrl.js";

const router = Router();

router.get("/prueba", pruebaHabitos);

router.get("/habitos", verifyToken, getHabitos);
router.get("/habitos/:id", verifyToken, getHabitoxId);
router.post("/habitos", verifyToken, postHabito);
router.put("/habitos/:id", verifyToken, putHabito);
router.delete("/habitos/:id", verifyToken, deleteHabito);

export default router;
