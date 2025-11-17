// controladores/medicosCtrl.js
// Controlador para la tabla medicos

import { conmysql } from "../db.js";
import cloudinary from "../cloudinary.js"; // 👈 AÑADIDO

// === PRUEBA DE CONEXIÓN ===
export const pruebaMedicos = (req, res) => {
  res.send("prueba con éxito - medicos");
};

// === OBTENER TODOS LOS MÉDICOS ===
export const getMedicos = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT m.*, u.nombre, u.correo 
       FROM medicos m
       INNER JOIN usuarios u ON u.usuario_id = m.usuario_id`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getMedicos:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER MÉDICO POR ID ===
export const getMedicoxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT m.*, u.nombre, u.correo 
       FROM medicos m
       INNER JOIN usuarios u ON u.usuario_id = m.usuario_id
       WHERE m.medico_id = ?`,
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({ cant: 0, message: "Médico no encontrado" });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getMedicoxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === INSERTAR MÉDICO (subiendo PDF a Cloudinary) ===
export const postMedico = async (req, res) => {
  try {
    const {
      usuario_id,
      numero_licencia,
      especialidad,
      institucion,
      años_experiencia,
      fecha_vencimiento_licencia,
      certificado_por,
      notas_certificacion,
    } = req.body;

    let documento_certificacion = null;

    // Si viene un archivo (PDF) lo subimos a Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "medicos_certificados",
            resource_type: "raw", // 👈 para PDF/archivos
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      documento_certificacion = uploadResult.secure_url;
    } else if (req.body.documento_certificacion) {
      // Por si algún día quieres permitir URL manual en el body
      documento_certificacion = req.body.documento_certificacion;
    }

    const [result] = await conmysql.query(
      `INSERT INTO medicos
       (usuario_id, numero_licencia, especialidad, institucion, años_experiencia,
        documento_certificacion, fecha_vencimiento_licencia, certificado_por, notas_certificacion)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        usuario_id,
        numero_licencia,
        especialidad,
        institucion,
        años_experiencia,
        documento_certificacion,
        fecha_vencimiento_licencia,
        certificado_por,
        notas_certificacion,
      ]
    );

    res.json({
      medico_id: result.insertId,
      documento_certificacion,
    });
  } catch (error) {
    console.error("Error en postMedico:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ACTUALIZAR MÉDICO (posible nuevo PDF a Cloudinary) ===
export const putMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero_licencia,
      especialidad,
      institucion,
      años_experiencia,
      fecha_vencimiento_licencia,
      certificado_por,
      notas_certificacion,
    } = req.body;

    // Obtenemos el documento actual por si no envían uno nuevo
    const [currentRows] = await conmysql.query(
      "SELECT documento_certificacion FROM medicos WHERE medico_id=?",
      [id]
    );

    if (currentRows.length === 0)
      return res.status(404).json({ message: "Médico no encontrado" });

    let documento_certificacion = currentRows[0].documento_certificacion;

    // Si viene nuevo PDF, subimos a Cloudinary y reemplazamos URL
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "medicos_certificados",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      documento_certificacion = uploadResult.secure_url;
    } else if (req.body.documento_certificacion) {
      // Si te mandan una URL en el body, también la aceptas
      documento_certificacion = req.body.documento_certificacion;
    }

    const [result] = await conmysql.query(
      `UPDATE medicos 
       SET numero_licencia=?, especialidad=?, institucion=?, años_experiencia=?,
           documento_certificacion=?, fecha_vencimiento_licencia=?, certificado_por=?, notas_certificacion=?
       WHERE medico_id=?`,
      [
        numero_licencia,
        especialidad,
        institucion,
        años_experiencia,
        documento_certificacion,
        fecha_vencimiento_licencia,
        certificado_por,
        notas_certificacion,
        id,
      ]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Médico no encontrado" });

    const [fila] = await conmysql.query(
      "SELECT * FROM medicos WHERE medico_id=?",
      [id]
    );
    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putMedico:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR MÉDICO ===
export const deleteMedico = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM medicos WHERE medico_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Médico no encontrado" });

    res.json({ message: "Médico eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteMedico:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
