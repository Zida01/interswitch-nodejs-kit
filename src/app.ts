import dotenv from 'dotenv';

dotenv.config();
//
import express, {Application, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import paymentRoutes from "./payment/payment.route"
import {LoggerUtils} from "./_lib/logger.utils";
import authRoutes from './auth/auth.route';


const appBootstrap = async () => {

    const app: Application = express();
    const PORT = process.env.PORT || 5000;


    // Our Middlewares goes here
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));


    //Our Application Routes Goes Here
    app.use('/api/v1/payment', paymentRoutes);
    app.use('/api/v1/user', authRoutes)


    app.listen(PORT, () => {
        LoggerUtils.info(`Server is running on http://localhost:${PORT}`);
    });
}


appBootstrap().then(() => {})



