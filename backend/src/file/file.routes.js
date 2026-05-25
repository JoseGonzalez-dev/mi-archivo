import { Router } from "express";
import { validateTokenJWT } from "../../middlewares/validate.jwt.js";
import { upload } from "../../config/cloudinary.js";
import { uploadFile, listFiles, removeFile, getSingleFile, updateFileName } from "./file.controller.js";

const api = Router();

// Todas las rutas de archivos necesitan autenticación
api.use(validateTokenJWT); 

api.post("/upload", upload.single("file"), uploadFile);
api.get("/", listFiles);
api.get("/:id", getSingleFile);
api.put("/:id", updateFileName);
api.delete("/:id", removeFile);

export default api;
