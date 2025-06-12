import dotenv from 'dotenv';

dotenv.config();
//
import express, {Application, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


const appBootstrap = async () => {
    const app: Application = express();
    const PORT = process.env.PORT || 5000;


    // Our Middlewares goes here
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));


    //Our Application Routes Goes Here

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}


appBootstrap().then(() => {
})



