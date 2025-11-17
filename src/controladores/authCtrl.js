// src/controladores/authCtrl.js
import { conmysql } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

// ================================
// === REGISTRO (crear login + usuario)
// ================================
export const register = async (req, res) => {
  try {
    const { usuario, clave, nombre, correo } = req.body;

    // 1. Verificar que no exista el usuario
    const [exist] = await conmysql.query(
      "SELECT * FROM login WHERE usuario = ?",
      [usuario]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // 2. Encriptar contraseña
    const hash = await bcrypt.hash(clave, 10);

    // 3. Insertar login
    const [loginResult] = await conmysql.query(
      "INSERT INTO login (usuario, contraseña) VALUES (?, ?)",
      [usuario, hash]
    );

    // 4. Crear usuario con rol por defecto (3 = paciente)
    const [userResult] = await conmysql.query(
      `INSERT INTO usuarios (login_id, rol_id, nombre, correo)
       VALUES (?, 3, ?, ?)`,
      [loginResult.insertId, nombre, correo]
    );

    // 5. Crear token
    const token = jwt.sign(
      {
        usuario_id: userResult.insertId,
        nombre: nombre,
        rol_id: 3,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Registro exitoso",
      token,
      usuario: {
        usuario_id: userResult.insertId,
        nombre,
        correo,
        rol_id: 3,
      },
    });

  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ================================
// === LOGIN
// ================================
export const login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    const [result] = await conmysql.query(
      "SELECT * FROM login WHERE usuario = ?",
      [usuario]
    );

    if (result.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const loginData = result[0];

    // Comparar contraseña
    const match = await bcrypt.compare(clave, loginData.contraseña);
    if (!match)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    // Obtener datos del usuario
    const [userData] = await conmysql.query(
      "SELECT * FROM usuarios WHERE login_id = ?",
      [loginData.login_id]
    );

    const user = userData[0];

    // Crear token
    const token = jwt.sign(
      {
        usuario_id: user.usuario_id,
        nombre: user.nombre,
        rol_id: user.rol_id,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: user,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
