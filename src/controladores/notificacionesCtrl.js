// controladores/notificacionesCtrl.js
// Tabla notificaciones_motivacion: mensajes de motivación al paciente.

import { conmysql } from "../db.js";

// === PRUEBA DE CONEXIÓN ===
export const pruebaNotificaciones = (req, res) => {
  res.send("prueba con éxito - notificaciones_motivacion");
};

// === OBTENER TODAS LAS NOTIFICACIONES ===
export const getNotificaciones = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT n.*, u.nombre, u.correo
       FROM notificaciones_motivacion n
       INNER JOIN usuarios u ON u.usuario_id = n.usuario_id`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getNotificaciones:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER NOTIFICACIONES POR USUARIO ===
export const getNotificacionesPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const [result] = await conmysql.query(
      "SELECT * FROM notificaciones_motivacion WHERE usuario_id=?",
      [usuario_id]
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getNotificacionesPorUsuario:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER NOTIFICACIÓN POR ID ===
export const getNotificacionxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM notificaciones_motivacion WHERE notificacion_id=?",
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({ cant: 0, message: "Notificación no encontrada" });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getNotificacionxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === CREAR NOTIFICACIÓN ===
export const postNotificacion = async (req, res) => {
  try {
    const { usuario_id, tipo, contenido, fecha_envio, estado } = req.body;

    const [result] = await conmysql.query(
      `INSERT INTO notificaciones_motivacion
       (usuario_id, tipo, contenido, fecha_envio, estado)
       VALUES (?,?,?,?,?)`,
      [usuario_id, tipo, contenido, fecha_envio, estado]
    );

    res.json({ notificacion_id: result.insertId });
  } catch (error) {
    console.error("Error en postNotificacion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ACTUALIZAR NOTIFICACIÓN ===
export const putNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, contenido, fecha_envio, estado } = req.body;

    const [result] = await conmysql.query(
      `UPDATE notificaciones_motivacion
       SET tipo=?, contenido=?, fecha_envio=?, estado=?
       WHERE notificacion_id=?`,
      [tipo, contenido, fecha_envio, estado, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Notificación no encontrada" });

    const [fila] = await conmysql.query(
      "SELECT * FROM notificaciones_motivacion WHERE notificacion_id=?",
      [id]
    );

    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putNotificacion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR NOTIFICACIÓN ===
export const deleteNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM notificaciones_motivacion WHERE notificacion_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Notificación no encontrada" });

    res.json({ message: "Notificación eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteNotificacion:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

