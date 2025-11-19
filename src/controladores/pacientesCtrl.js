// src/controladores/pacientesCtrl.js
import { conmysql } from "../db.js";

// ================================
// PRUEBA
// ================================
export const pruebaPacientes = (req, res) => {
  res.send("Prueba con éxito - pacientes");
};

// ================================
// OBTENER TODOS LOS PACIENTES (usuarios rol=3)
// ================================
export const getPacientes = async (req, res) => {
  try {
    const [rows] = await conmysql.query(`
      SELECT usuario_id, nombre, correo, peso, estatura, edad 
      FROM usuarios 
      WHERE rol_id = 3
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
// OBTENER PACIENTE POR ID
// ================================
export const getPacientexId = async (req, res) => {
  try {
    const [rows] = await conmysql.query(
      `SELECT usuario_id, nombre, correo, peso, estatura, edad 
       FROM usuarios 
       WHERE usuario_id=? AND rol_id=3`,
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
// ELIMINAR PACIENTE (usuario + login)
// ================================
export const deletePaciente = async (req, res) => {
  try {
    const pacienteId = req.params.id;

    // Obtener login_id
    const [[usuario]] = await conmysql.query(
      "SELECT login_id FROM usuarios WHERE usuario_id=? AND rol_id=3",
      [pacienteId]
    );

    if (!usuario)
      return res.status(404).json({ message: "Paciente no encontrado" });

    const login_id = usuario.login_id;

    // Eliminar usuario
    await conmysql.query(
      "DELETE FROM usuarios WHERE usuario_id=? AND rol_id=3",
      [pacienteId]
    );

    // Eliminar login
    if (login_id) {
      await conmysql.query(
        "DELETE FROM login WHERE login_id = ?",
        [login_id]
      );
    }

    res.json({ message: "Paciente eliminado correctamente" });

  } catch (error) {
    console.error("Error en deletePaciente:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

