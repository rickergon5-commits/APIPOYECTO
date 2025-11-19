// app.js
import express from "express";
import cors from "cors";


// === IMPORTACIÓN DE RUTAS ===
import usuariosRoutes from "./routes/usuarios.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import administradoresRoutes from "./routes/administradores.routes.js";
import medicosRoutes from "./routes/medicos.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import habitosRoutes from "./routes/habitos.routes.js";
import planHabitosRoutes from "./routes/planHabitos.routes.js";
import cumplimientoRoutes from "./routes/cumplimiento.routes.js";
import prediccionesRoutes from "./routes/predicciones.routes.js";
import analisisRoutes from "./routes/analisis.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import authRoutes from "./routes/auth.routes.js";
import pacientesRoutes from "./routes/pacientes.routes.js";

const app = express();

// =============== MIDDLEWARES GLOBALES ===============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // apps móviles, Postman, curl, etc.
    const allowedOrigins = [
      "https://apiproyecto20252.onrender.com",
      "http://localhost:8100",    // Ionic local
      "capacitor://localhost",    // App Android/iOS
      "http://localhost",         // WebView / navegador local
      "https://localhost",
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS rechazado:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// =============== REGISTRO DE RUTAS ===============
app.use("/api/auth", authRoutes);
app.use("/api", usuariosRoutes);
app.use("/api", rolesRoutes);
app.use("/api", administradoresRoutes);
app.use("/api", medicosRoutes);
app.use("/api", solicitudesRoutes);
app.use("/api", habitosRoutes);
app.use("/api", planHabitosRoutes);
app.use("/api", cumplimientoRoutes);
app.use("/api", prediccionesRoutes);
app.use("/api", analisisRoutes);
app.use("/api", notificacionesRoutes);
app.use("/api", pacientesRoutes);
// =============== MANEJO 404 ===============
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

export default app;
