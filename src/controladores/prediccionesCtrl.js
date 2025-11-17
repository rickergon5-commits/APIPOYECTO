// controladores/prediccionesCtrl.js
// Tabla predicciones: donde la IA guarda probabilidad de cumplimiento y recomendaciones.

import { conmysql } from "../db.js";

// === PRUEBA DE CONEXIÓN ===
export const pruebaPredicciones = (req, res) => {
  res.send("prueba con éxito - predicciones");
};

// === OBTENER TODAS LAS PREDICCIONES ===
export const getPredicciones = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT p.*, ph.usuario_id, ph.habito_id
       FROM predicciones p
       INNER JOIN plan_habitos ph ON ph.plan_habito_id = p.plan_habito_id`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getPredicciones:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER PREDICCIONES POR PLAN_HABITO_ID ===
export const getPrediccionesPorPlan = async (req, res) => {
  try {
    const { plan_habito_id } = req.params;

    const [result] = await conmysql.query(
      "SELECT * FROM predicciones WHERE plan_habito_id=?",
      [plan_habito_id]
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getPrediccionesPorPlan:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER PREDICCIÓN POR ID ===
export const getPrediccionxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM predicciones WHERE prediccion_id=?",
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({ cant: 0, message: "Predicción no encontrada" });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getPrediccionxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === CREAR PREDICCIÓN ===
export const postPrediccion = async (req, res) => {
  try {
    const {
      plan_habito_id,
      fecha_prediccion,
      probabilidad_cumplimiento,
      recomendacion,
    } = req.body;

    const [result] = await conmysql.query(
      `INSERT INTO predicciones
       (plan_habito_id, fecha_prediccion, probabilidad_cumplimiento, recomendacion)
       VALUES (?,?,?,?)`,
      [
        plan_habito_id,
        fecha_prediccion,
        probabilidad_cumplimiento,
        recomendacion,
      ]
    );

    res.json({ prediccion_id: result.insertId });
  } catch (error) {
    console.error("Error en postPrediccion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ACTUALIZAR PREDICCIÓN ===
export const putPrediccion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_prediccion,
      probabilidad_cumplimiento,
      recomendacion,
    } = req.body;

    const [result] = await conmysql.query(
      `UPDATE predicciones
       SET fecha_prediccion=?, probabilidad_cumplimiento=?, recomendacion=?
       WHERE prediccion_id=?`,
      [fecha_prediccion, probabilidad_cumplimiento, recomendacion, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Predicción no encontrada" });

    const [fila] = await conmysql.query(
      "SELECT * FROM predicciones WHERE prediccion_id=?",
      [id]
    );

    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putPrediccion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR PREDICCIÓN ===
export const deletePrediccion = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM predicciones WHERE prediccion_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Predicción no encontrada" });

    res.json({ message: "Predicción eliminada correctamente" });
  } catch (error) {
    console.error("Error en deletePrediccion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

