import express from "express";
import { conmysql } from "../db.js";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Historial por usuario en memoria
const historial = {};

router.post("/chat-habitos", async (req, res) => {
  const { usuario_id, mensaje } = req.body;

  if (!usuario_id || !mensaje) {
    return res.status(400).json({ error: "Faltan datos (usuario_id, mensaje)" });
  }

  try {
    const [habitos] = await conmysql.query(
      `
      SELECT h.nombre_habito AS nombre, h.descripcion,
             ph.frecuencia, ph.estado
      FROM plan_habitos ph
      INNER JOIN registro_habitos h ON h.habito_id = ph.habito_id
      WHERE ph.usuario_id = ?
      `,
      [usuario_id]
    );

    const contextoHabitos = habitos
      .map(
        (h) => `
Hábito: ${h.nombre}
Descripción: ${h.descripcion || "sin descripción"}
Frecuencia: ${h.frecuencia || "no especificada"}
Estado actual: ${h.estado || "desconocido"}
--------`
      )
      .join("\n");

    if (!historial[usuario_id]) historial[usuario_id] = [];

    const prompt = `
Eres un asistente de salud positivo y motivador.
Responde SIEMPRE en español.
Da recomendaciones personalizadas basadas en los datos reales del paciente.

HÁBITOS DEL PACIENTE:
${contextoHabitos}

HISTORIAL:
${historial[usuario_id].join("\n")}

MENSAJE:
${mensaje}

RESPUESTA DEL ASISTENTE (máximo 4 frases):
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const texto =
      completion.choices?.[0]?.message?.content ||
      "Lo siento, no pude generar respuesta.";

    historial[usuario_id].push("Usuario: " + mensaje);
    historial[usuario_id].push("Asistente: " + texto);
    if (historial[usuario_id].length > 20) historial[usuario_id].splice(0, 2);

    return res.json({ respuesta: texto });

  } catch (error) {
    console.error("Error en chatbot:", error);
    return res.status(500).json({ error: "Error interno en el chatbot" });
  }
});

export default router;
