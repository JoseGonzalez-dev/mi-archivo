import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import { limiter } from "../middlewares/rate.limit.js";
import authRoutes from "../src/auth/auth.routes.js";

dotenv.config();

const config = (app) => {
    app.set("trust proxy", 1);
    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(limiter);
}

const routes = (app) => {
    const route = "/api/v1/miarchivo";
    app.use(`${route}/auth`, authRoutes);
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