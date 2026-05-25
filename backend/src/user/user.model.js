import { getPool } from "../../config/mssql.js";
import sql from "mssql";

export const findByIdentifier = async (identifier) => {
    const pool = getPool();

    const result = await pool.request()
        .input("identifier", sql.NVarChar, identifier)
        .query("SELECT * FROM Usuario WHERE Email = @identifier OR Nickname = @identifier");
    return result.recordset[0] ?? null;
}

export const createUser = async (userData) => {
    const pool = getPool();

    const result = await pool.request()
        .input("nombres", sql.NVarChar, userData.nombres)
        .input("apellidos", sql.NVarChar, userData.apellidos)
        .input("email", sql.NVarChar, userData.email)
        .input("nickname", sql.NVarChar, userData.nickname)
        .input("password", sql.NVarChar, userData.password)
        .query("INSERT INTO Usuario (Nombres, Apellidos, Email, Nickname, Password) OUTPUT INSERTED.* VALUES (@nombres, @apellidos, @email, @nickname, @password)");
    return result.recordset[0];
}