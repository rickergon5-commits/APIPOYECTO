export const verifyRole = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const rolUsuario = req.user?.rol_id;
    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
    next();
  };
};
