import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { limiter } from "../middlewares/rate.limit.js";
import authRoutes from "../src/auth/auth.routes.js";
import fileRoutes from "../src/file/file.routes.js";

dotenv.config();

const config = (app) => {
    app.set("trust proxy", 1);
    app.use(helmet());
    app.use(cors(
        {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    ));
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(limiter);
}

const routes = (app) => {
    const route = "/api/v1/miarchivo";
    app.use(`${route}/auth`, authRoutes);
    app.use(`${route}/files`, fileRoutes);
}

export const initServer = () => {
    const app = express();
    try {
        config(app);
        routes(app);
        
        app.listen(process.env.PORT, () => {
            console.log(`Servidor iniciado en el puerto ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor: ", error);
        process.exit(1);
    }
}