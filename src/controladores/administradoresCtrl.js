// controladores/administradoresCtrl.js
// Controlador para la tabla administradores
// Guarda datos extra de usuarios que son administradores (nivel de acceso, departamento, etc.)

import { conmysql } from "../db.js";

// === PRUEBA DE CONEXIÓN ===
export const pruebaAdmins = (req, res) => {
  res.send("prueba con éxito - administradores");
};

// === OBTENER TODOS LOS ADMINISTRADORES ===
export const getAdministradores = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT a.*, u.nombre, u.correo 
       FROM administradores a
       INNER JOIN usuarios u ON u.usuario_id = a.usuario_id`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getAdministradores:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === OBTENER ADMINISTRADOR POR ID ===
export const getAdministradorxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT a.*, u.nombre, u.correo 
       FROM administradores a
       INNER JOIN usuarios u ON u.usuario_id = a.usuario_id
       WHERE a.admin_id = ?`,
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({ cant: 0, message: "Administrador no encontrado" });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getAdministradorxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === INSERTAR ADMINISTRADOR ===
export const postAdministrador = async (req, res) => {
  try {
    const { usuario_id, nivel_acceso, departamento } = req.body;

    const [result] = await conmysql.query(
      `INSERT INTO administradores 
       (usuario_id, nivel_acceso, departamento)
       VALUES (?,?,?)`,
      [usuario_id, nivel_acceso, departamento]
    );

    res.json({ admin_id: result.insertId });
  } catch (error) {
    console.error("Error en postAdministrador:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ACTUALIZAR ADMINISTRADOR ===
export const putAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nivel_acceso, departamento } = req.body;

    const [result] = await conmysql.query(
      `UPDATE administradores 
       SET nivel_acceso=?, departamento=?
       WHERE admin_id=?`,
      [nivel_acceso, departamento, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Administrador no encontrado" });

    const [fila] = await conmysql.query(
      "SELECT * FROM administradores WHERE admin_id=?",
      [id]
    );
    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putAdministrador:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// === ELIMINAR ADMINISTRADOR ===
export const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM administradores WHERE admin_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Administrador no encontrado" });

    res.json({ message: "Administrador eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteAdministrador:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
