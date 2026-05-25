import multer from "multer";
import fs from "fs";

// Asegurar que el directorio de subidas exista
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Guardar de forma segura con un timestamp y el nombre original
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Puedes agregar un filtro si necesitas restringir por tipo de archivo
export const upload = multer({ storage });
