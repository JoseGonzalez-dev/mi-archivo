import { getPool } from "../../config/mssql.js";
import sql from "mssql";

export const createFile = async (fileData) => {
    const pool = getPool();
    const result = await pool.request()
        .input("nombre", sql.NVarChar, fileData.nombre)
        .input("ruta", sql.NVarChar, fileData.ruta)
        .input("tipoArchivo", sql.NVarChar, fileData.tipoArchivo)
        .input("tamanyo", sql.Int, fileData.tamanyo)
        .input("id_usuario", sql.Int, fileData.id_usuario)
        .query("INSERT INTO Archivos (Nombre, Ruta, TipoArchivo, Tamanyo, Id_Usuario) OUTPUT INSERTED.* VALUES (@nombre, @ruta, @tipoArchivo, @tamanyo, @id_usuario)");
    return result.recordset[0];
};

export const getFilesByUser = async (id_usuario) => {
    const pool = getPool();
    const result = await pool.request()
        .input("id_usuario", sql.Int, id_usuario)
        .query("SELECT * FROM Archivos WHERE Id_Usuario = @id_usuario");
    return result.recordset;
};

export const getFileById = async (id, id_usuario) => {
    const pool = getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("id_usuario", sql.Int, id_usuario)
        .query("SELECT * FROM Archivos WHERE Id = @id AND Id_Usuario = @id_usuario");
    return result.recordset[0] ?? null;
};

export const deleteFile = async (id, id_usuario) => {
    const pool = getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("id_usuario", sql.Int, id_usuario)
        .query("DELETE FROM Archivos OUTPUT DELETED.* WHERE Id = @id AND Id_Usuario = @id_usuario");
    return result.recordset[0];
};

export const updateFileName = async (id, id_usuario, newNombre) => {
    const pool = getPool();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("id_usuario", sql.Int, id_usuario)
        .input("nombre", sql.NVarChar, newNombre)
        .query("UPDATE Archivos SET Nombre = @nombre OUTPUT INSERTED.* WHERE Id = @id AND Id_Usuario = @id_usuario");
    return result.recordset[0] ?? null;
};
