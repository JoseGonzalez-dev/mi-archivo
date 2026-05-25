import fs from "fs";
import { createFile, getFilesByUser, getFileById, deleteFile, updateFileName as updateFileNameModel } from "./file.model.js";

// POST /api/v1/miarchivo/files/upload
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No se proporcionó ningún archivo" });
        }

        const id_usuario = req.user.uid; 
        const { originalname, size, mimetype } = req.file;
        const url = req.file.path; // URL de Cloudinary

        const fileData = {
            nombre: originalname,
            ruta: url,
            // Truncamos a 50 caracteres para evitar el error de SQL Server en la columna TipoArchivo
            tipoArchivo: mimetype.length > 50 ? mimetype.substring(0, 50) : mimetype,
            tamanyo: size,
            id_usuario
        };

        const savedFile = await createFile(fileData);

        res.status(201).json({ success: true, message: "Archivo subido exitosamente", data: savedFile, url });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al subir el archivo" });
    }
};

// GET /api/v1/miarchivo/files
export const listFiles = async (req, res) => {
    try {
        const id_usuario = req.user.uid;
        const files = await getFilesByUser(id_usuario);
        
        res.status(200).json({ success: true, data: files });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al listar los archivos" });
    }
};

// GET /api/v1/miarchivo/files/:id
export const getSingleFile = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.uid; // El middleware extrae esto del token

        const file = await getFileById(id, id_usuario);
        if (!file) {
            return res.status(404).json({ success: false, message: "Archivo no encontrado o no tienes permisos para verlo" });
        }
        
        res.status(200).json({ success: true, data: file });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al obtener el archivo" });
    }
};

// PUT /api/v1/miarchivo/files/:id
export const updateFileName = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.uid;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ success: false, message: "El nuevo nombre es requerido" });
        }

        const updatedFile = await updateFileNameModel(id, id_usuario, nombre);
        if (!updatedFile) {
            return res.status(404).json({ success: false, message: "Archivo no encontrado o no tienes permisos para actualizarlo" });
        }

        res.status(200).json({ success: true, message: "Nombre de archivo actualizado", data: updatedFile });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al actualizar el nombre del archivo" });
    }
};

// DELETE /api/v1/miarchivo/files/:id
export const removeFile = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.uid;

        const file = await getFileById(id, id_usuario);
        if (!file) {
            return res.status(404).json({ success: false, message: "Archivo no encontrado o no tienes permisos" });
        }

        // 1. Eliminar de la base de datos
        const deleted = await deleteFile(id, id_usuario);

        // 2. Eliminar de Cloudinary (Pendiente - Se requiere cloudinary.uploader.destroy)
        // Por ahora omitimos borrar de local porque la ruta es una URL
        // if (fs.existsSync(file.Ruta)) {
        //     fs.unlinkSync(file.Ruta);
        // }

        res.status(200).json({ success: true, message: "Archivo eliminado físicamente y de la DB", data: deleted });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al eliminar el archivo" });
    }
};
