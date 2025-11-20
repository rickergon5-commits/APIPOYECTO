import { conmysql } from "../db.js";

export const pruebaCumplimiento = (req, res) => {
  res.send("prueba con éxito - registro_cumplimiento");
};

export const getRegistrosCumplimiento = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      `SELECT rc.*, ph.usuario_id, ph.habito_id
       FROM registro_cumplimiento rc
       INNER JOIN plan_habitos ph ON ph.plan_habito_id = rc.plan_habito_id`
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getRegistrosCumplimiento:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getCumplimientoPorPlan = async (req, res) => {
  try {
    const { plan_habito_id } = req.params;

    const [result] = await conmysql.query(
      "SELECT * FROM registro_cumplimiento WHERE plan_habito_id=?",
      [plan_habito_id]
    );

    res.json({
      cant: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Error en getCumplimientoPorPlan:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getCumplimientoxId = async (req, res) => {
  try {
    const [result] = await conmysql.query(
      "SELECT * FROM registro_cumplimiento WHERE registro_id=?",
      [req.params.id]
    );

    if (result.length <= 0)
      return res.json({
        cant: 0,
        message: "Registro de cumplimiento no encontrado",
      });

    res.json({
      cant: result.length,
      data: result[0],
    });
  } catch (error) {
    console.error("Error en getCumplimientoxId:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const postCumplimiento = async (req, res) => {
  try {
    const { plan_habito_id, fecha, cumplido, nota } = req.body;

    const [result] = await conmysql.query(
      `INSERT INTO registro_cumplimiento
       (plan_habito_id, fecha, cumplido, nota)
       VALUES (?,?,?,?)`,
      [plan_habito_id, fecha, cumplido, nota]
    );

    res.json({ registro_id: result.insertId });
  } catch (error) {
    console.error("Error en postCumplimiento:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const putCumplimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, cumplido, nota } = req.body;

    const [result] = await conmysql.query(
      `UPDATE registro_cumplimiento
       SET fecha=?, cumplido=?, nota=?
       WHERE registro_id=?`,
      [fecha, cumplido, nota, id]
    );

    if (result.affectedRows <= 0)
      return res
        .status(404)
        .json({ message: "Registro de cumplimiento no encontrado" });

    const [fila] = await conmysql.query(
      "SELECT * FROM registro_cumplimiento WHERE registro_id=?",
      [id]
    );
    res.json(fila[0]);
  } catch (error) {
    console.error("Error en putCumplimiento:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteCumplimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM registro_cumplimiento WHERE registro_id=?",
      [id]
    );

    if (result.affectedRows <= 0)
      return res
        .status(404)
        .json({ message: "Registro de cumplimiento no encontrado" });

    res.json({ message: "Registro de cumplimiento eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteCumplimiento:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
