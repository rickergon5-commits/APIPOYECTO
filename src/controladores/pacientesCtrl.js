// src/controladores/pacientesCtrl.js
import { conmysql } from "../db.js";

// ================================
// PRUEBA
// ================================
export const pruebaPacientes = (req, res) => {
  res.send("Prueba con éxito - pacientes");
};

// ================================
// OBTENER TODOS LOS PACIENTES (solo admin)
// ================================
export const getPacientes = async (req, res) => {
  try {
    const [rows] = await conmysql.query(`
      SELECT u.*
      FROM usuarios u
      WHERE u.rol_id = 3
    `);

    res.json({
      cant: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Error en getPacientes:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// OBTENER PACIENTE POR ID (solo admin)
// ================================
export const getPacientexId = async (req, res) => {
  try {
    const [rows] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usuario_id=? AND rol_id=3",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Paciente no encontrado" });

    res.json(rows[0]);

  } catch (error) {
    console.error("Error en getPacientexId:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// ELIMINAR PACIENTE (usuario + cualquier dato relacionado)
// ================================
export const deletePaciente = async (req, res) => {
  try {
    const pacienteId = req.params.id;

    // Borrar de usuarios (rol=3)
    const [result] = await conmysql.query(
      "DELETE FROM usuarios WHERE usuario_id=? AND rol_id=3",
      [pacienteId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Paciente no encontrado" });

    res.json({ message: "Paciente eliminado correctamente" });

  } catch (error) {
    console.error("Error en deletePaciente:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
