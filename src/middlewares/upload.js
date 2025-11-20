import multer from "multer";

const storage = multer.memoryStorage();


export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|gif/;
    const mimeOk = allowed.test(file.mimetype);
    const extOk = allowed.test(file.originalname.toLowerCase());

    if (mimeOk && extOk) return cb(null, true);

    cb(new Error("Solo se permiten imágenes (jpg, jpeg, png, gif)"));
  },
});


export const uploadPDF = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowed = /pdf/;
    const mimeOk = file.mimetype === "application/pdf";
    const extOk = allowed.test(file.originalname.toLowerCase());

    if (mimeOk && extOk) return cb(null, true);

    cb(new Error("Solo se permiten archivos PDF"));
  },
});
