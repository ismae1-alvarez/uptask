import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrores } from "../middleware/validation";

const router:Router =  Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no debe ir vacio'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req})=>{
            if( value !==  req.body.password) throw new Error('Los password no son iguales');
            return true;
        }), 
    body('email')
        .notEmpty().withMessage('El e-mail no debe ir vacio'),
    handleInputErrores,
    AuthController.createAccount
);

export default router;
