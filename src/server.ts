import express from 'express';
import type {Express} from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';
import morgan from 'morgan';

dotenv.config();


connectDB();

const app:Express = express();

app.use(cors(corsConfig));

// Logging
app.use(morgan('dev'));


// Middlware para hacerlo json
app.use(express.json());

// Routes
app.use('/api/projects/',projectRoutes);


export default app;
