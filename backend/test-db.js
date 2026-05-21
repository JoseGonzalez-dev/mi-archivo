import "dotenv/config";
import sql from "mssql";

console.log("Password from dotenv:", process.env.DB_PASSWORD);
console.log("Connecting to:", process.env.DB_SERVER, "User:", process.env.DB_USER);

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: "master", // Conectar a master para probar
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

(async () => {
    try {
        await sql.connect(config);
        console.log("Connected to master successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
})();
