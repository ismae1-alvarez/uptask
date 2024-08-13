import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputErrores = (req:Request, res:Response, next:NextFunction)=>{

    let errores = validationResult(req);

    if(!errores.isEmpty())return res.status(400).json({errors: errores.array()});

    next();
};