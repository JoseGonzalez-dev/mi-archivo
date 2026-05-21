import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const config = (app) => {
    app.set('trust proxy', 1);
    app.use(helmet());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
}

const routes = (app) => {

}

export const initServer = () => {
    const app = express();
    try {
        config(app);
        app.listen(process.env.PORT, () => {
            console.log(`Servidor iniciado en el puerto ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor: ', error);
        process.exit(1);
    }
}