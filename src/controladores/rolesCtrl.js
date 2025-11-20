import { conmysql } from "../db.js";

export const pruebaRoles = (req, res) => {
  res.send("prueba con éxito - roles");
};

export const getRoles = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM roles");

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getRoles:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getRolxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM roles WHERE rol_id = ?",
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({ cant: 0, message: "Rol no encontrado" });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getRolxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const postRol = async (req, res) => {
  try {
    const { nombre_rol, descripcion } = req.body;

    const [result] = await conmysql.query(
      "INSERT INTO roles (nombre_rol, descripcion) VALUES (?,?)",
      [nombre_rol, descripcion]
    );

    res.json({ rol_id: result.insertId });
  } catch (error) {
    console.error("Error en postRol:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const putRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;

    const [result] = await conmysql.query(
      "UPDATE roles SET nombre_rol=?, descripcion=? WHERE rol_id=?",
      [nombre_rol, descripcion, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Rol no encontrado" });

    const [fila] = await conmysql.query(
      "SELECT * FROM roles WHERE rol_id=?",
      [id]
    );
    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putRol:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query(
      "DELETE FROM roles WHERE rol_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "Rol no encontrado" });

    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteRol:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
