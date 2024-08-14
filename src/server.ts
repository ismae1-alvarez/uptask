import express from 'express';
import type {Express} from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';

dotenv.config();


connectDB();

const app:Express = express();

app.use(cors(corsConfig));

app.use(express.json());

// Routes
app.use('/api/projects/',projectRoutes);


export default app;
