import sql from "mssql";

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true //Desarrollo local
    }
}

let pool

export const connectDB = async () => {
    try {
        console.log("MSSQL | Intentando conectar...");
        pool = await sql.connect(config);
        console.log("MSSQL | Base de datos conectada exitosamente");
    } catch (error) {
        console.error("MSSQL | Error al conectar a la base de datos: ", error);
        process.exit(1);
    }
}

export const getPool = () => {
    if (!pool) throw new Error("La base de datos no esta conectada.");
    return pool;
}

export default sql;