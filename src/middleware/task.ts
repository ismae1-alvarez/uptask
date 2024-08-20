import type {Request, Response, NextFunction} from 'express';
import Task ,{ ITask } from '../models/Tasks';
import mongoose from 'mongoose';

declare global {
    namespace Express{
        interface Request{
            task: ITask;
        }
    }
};



export async function taksExists(req:Request, res:Response, next:NextFunction) {
    try {
        const { taskId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'ID de tarea no válido' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }

        req.task =  task

        next();
    } catch (error) {
        res.status(500).json({error : 'Hubo un error 2'});
    };
};

export async function taskBelongToProject(req:Request, res:Response, next:NextFunction) {
    if(req.task.project.toString() !== req.project.id.toString()){
        const error =  new Error('Accion no valida');
        return res.status(400).json({error:error.message});
    };
    next();
};

export async function hasAutorization(req:Request, res:Response, next:NextFunction) {
    if(req.user.id.toString() !== req.project.manager.toString()){
        const error =  new Error('Accion no valida');
        return res.status(400).json({error:error.message});
    };
    next();
};