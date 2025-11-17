// src/controladores/usuariosCtrl.js
import { conmysql } from "../db.js";

// ================================
// PRUEBA DE CONEXIÓN
// ================================
export const pruebaUsuarios = (req, res) => {
  res.send("Prueba con éxito - usuarios");
};

// ================================
// OBTENER TODOS LOS USUARIOS (solo admin)
// ================================
export const getUsuarios = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM usuarios");

    res.json({
      cant: result.length,
      data: result,
    });

  } catch (error) {
    console.error("Error en getUsuarios:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// OBTENER USUARIO POR ID 
// (admin o el mismo usuario)
// ================================
export const getUsuarioxId = async (req, res) => {
  try {
    const usuarioIdSolicitado = parseInt(req.params.id);
    const usuarioTokenId = req.user?.usuario_id;
    const rol = req.user?.rol_id;

    // Validación: un usuario solo puede verse a sí mismo,
    // excepto si es admin (rol_id = 1)
    if (rol !== 1 && usuarioIdSolicitado !== usuarioTokenId) {
      return res.status(403).json({ message: "No puedes ver datos de otro usuario" });
    }

    const [result] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usuario_id = ?",
      [req.params.id]
    );

    if (result.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(result[0]);

  } catch (error) {
    console.error("Error en getUsuarioxId:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// CREAR USUARIO (solo admin)
// ================================
export const postUsuario = async (req, res) => {
  try {
    const {
      login_id,
      rol_id,
      nombre,
      correo,
      peso,
      estatura,
      edad
    } = req.body;

    const [result] = await conmysql.query(
      `INSERT INTO usuarios 
        (login_id, rol_id, nombre, correo, peso, estatura, edad)
       VALUES (?,?,?,?,?,?,?)`,
      [login_id, rol_id, nombre, correo, peso, estatura, edad]
    );

    res.json({ usuario_id: result.insertId });

  } catch (error) {
    console.error("Error en postUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// ACTUALIZAR USUARIO (solo admin)
// ================================
export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      rol_id,
      nombre,
      correo,
      peso,
      estatura,
      edad
    } = req.body;

    const [result] = await conmysql.query(
      `UPDATE usuarios SET 
        rol_id = ?, nombre = ?, correo = ?, 
        peso = ?, estatura = ?, edad = ?
       WHERE usuario_id = ?`,
      [rol_id, nombre, correo, peso, estatura, edad, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const [user] = await conmysql.query(
      "SELECT * FROM usuarios WHERE usuario_id = ?",
      [id]
    );

    res.json(user[0]);

  } catch (error) {
    console.error("Error en putUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// ELIMINAR USUARIO (solo admin)
// ================================
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM usuarios WHERE usuario_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
