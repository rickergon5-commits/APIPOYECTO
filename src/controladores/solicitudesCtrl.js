// controladores/solicitudesCertCtrl.js
// Maneja el flujo de usuarios que piden convertirse en médicos.
// Guarda estado: pendiente, en_revision, aprobado, rechazado.

import { conmysql } from "../db.js";

// === PRUEBA DE CONEXIÓN ===
export const pruebaSolicitudes = (req, res) => {
  res.send("prueba con éxito - solicitudes_certificacion");
};

// === OBTENER TODAS LAS SOLICITUDES ===
export const getSolicitudes = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT s.*, u.nombre, u.correo, a.nivel_acceso
       FROM solicitudes_certificacion s
       INNER JOIN usuarios u ON u.usuario_id = s.usuario_id
       LEFT JOIN administradores a ON a.admin_id = s.revisado_por`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getSolicitudes:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER SOLICITUD POR ID ===
export const getSolicitudxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT s.*, u.nombre, u.correo, a.nivel_acceso
       FROM solicitudes_certificacion s
       INNER JOIN usuarios u ON u.usuario_id = s.usuario_id
       LEFT JOIN administradores a ON a.admin_id = s.revisado_por
       WHERE s.solicitud_id = ?`,
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({
        cant: 0,
        message: "Solicitud no encontrada",
      });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getSolicitudxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === CREAR NUEVA SOLICITUD ===
export const postSolicitud = async (req, res) => {
  try {
    const { usuario_id, numero_licencia, especialidad, institucion } = req.body;
    const documento_adjunto = req.file?.filename || null;

    const [result] = await conmysql.query(
      `INSERT INTO solicitudes_certificacion
       (usuario_id, numero_licencia, especialidad, institucion, documento_adjunto)
       VALUES (?,?,?,?,?)`,
      [usuario_id, numero_licencia, especialidad, institucion, documento_adjunto]
    );

    res.json({ solicitud_id: result.insertId });
  } catch (error) {
    console.error("Error en postSolicitud:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ACTUALIZAR SOLICITUD (ESTADO, REVISIÓN) ===
export const putSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estado,
      fecha_revision,
      revisado_por,
      comentarios_revision,
      numero_licencia,
      especialidad,
      institucion,
      documento_adjunto,
    } = req.body;

    const [result] = await conmysql.query(
      `UPDATE solicitudes_certificacion
       SET estado=?, fecha_revision=?, revisado_por=?, comentarios_revision=?,
           numero_licencia=?, especialidad=?, institucion=?, documento_adjunto=?
       WHERE solicitud_id=?`,
      [
        estado,
        fecha_revision,
        revisado_por,
        comentarios_revision,
        numero_licencia,
        especialidad,
        institucion,
        documento_adjunto,
        id,
      ]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    const [fila] = await conmysql.query(
      "SELECT * FROM solicitudes_certificacion WHERE solicitud_id=?",
      [id]
    );

    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putSolicitud:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR SOLICITUD ===
export const deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM solicitudes_certificacion WHERE solicitud_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteSolicitud:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
