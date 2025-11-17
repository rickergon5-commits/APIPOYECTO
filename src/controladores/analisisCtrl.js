// controladores/analisisCtrl.js
// Tabla analisis: análisis emocional o de texto basado en el cumplimiento.

import { conmysql } from "../db.js";

// === PRUEBA DE CONEXIÓN ===
export const pruebaAnalisis = (req, res) => {
  res.send("prueba con éxito - analisis");
};

// === OBTENER TODOS LOS ANÁLISIS ===
export const getAnalisis = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT a.*, rc.plan_habito_id, rc.fecha
       FROM analisis a
       INNER JOIN registro_cumplimiento rc ON rc.registro_id = a.registro_id`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getAnalisis:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER ANÁLISIS POR REGISTRO_ID ===
export const getAnalisisPorRegistro = async (req, res) => {
  try {
    const { registro_id } = req.params;

    const [result] = await conmysql.query(
      "SELECT * FROM analisis WHERE registro_id=?",
      [registro_id]
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getAnalisisPorRegistro:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER ANÁLISIS POR ID ===
export const getAnalisisxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM analisis WHERE analisis_id=?",
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({ cant: 0, message: "Análisis no encontrado" });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getAnalisisxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === CREAR ANÁLISIS ===
export const postAnalisis = async (req, res) => {
  try {
    const { registro_id, emocion_detectada, mensaje_generado, fecha_analisis } =
      req.body;

    const [result] = await conmysql.query(
      `INSERT INTO analisis
       (registro_id, emocion_detectada, mensaje_generado, fecha_analisis)
       VALUES (?,?,?,?)`,
      [registro_id, emocion_detectada, mensaje_generado, fecha_analisis]
    );

    res.json({ analisis_id: result.insertId });
  } catch (error) {
    console.error("Error en postAnalisis:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ACTUALIZAR ANÁLISIS ===
export const putAnalisis = async (req, res) => {
  try {
    const { id } = req.params;
    const { emocion_detectada, mensaje_generado, fecha_analisis } = req.body;

    const [result] = await conmysql.query(
      `UPDATE analisis
       SET emocion_detectada=?, mensaje_generado=?, fecha_analisis=?
       WHERE analisis_id=?`,
      [emocion_detectada, mensaje_generado, fecha_analisis, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Análisis no encontrado" });

    const [fila] = await conmysql.query(
      "SELECT * FROM analisis WHERE analisis_id=?",
      [id]
    );

    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putAnalisis:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR ANÁLISIS ===
export const deleteAnalisis = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM analisis WHERE analisis_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Análisis no encontrado" });

    res.json({ message: "Análisis eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteAnalisis:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
