import "dotenv/config";
import { connectDB } from "./config/mssql.js";
import { initServer } from "./config/app.js"

connectDB();
initServer();