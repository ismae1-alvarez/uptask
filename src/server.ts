import express, {Express} from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db';


dotenv.config();


connectDB();

const server:Express = express();

export default server;
