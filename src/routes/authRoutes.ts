import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
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

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('el token no pude ir vacio'),
    handleInputErrores,
    AuthController.confirmAccount
);


router.post('/login', 
    body('email')
        .notEmpty().withMessage('El e-mail no debe ir vacio'),
    body('password')
        .notEmpty().withMessage('El password no debe ir vacio'),
    handleInputErrores,
    AuthController.login
);

router.post('/request-code', 
    body('email')
        .notEmpty().withMessage('El e-mail no debe ir vacio'),
    handleInputErrores,
    AuthController.requestConfirmationcode
);

router.post('/forgot-password', 
    body('email')
        .notEmpty().withMessage('El e-mail no debe ir vacio'),
    handleInputErrores,
    AuthController.forgotPassword
);

router.post('/validate-token', 
    body('token')
        .notEmpty().withMessage('el token no pude ir vacio'),
    handleInputErrores,
    AuthController.validateToken
);

router.post('/update-password/:token', 
    param('token')
        .isNumeric().withMessage('Token no valido'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, {req})=>{
            if( value !==  req.body.password) throw new Error('Los password no son iguales');
            return true;
        }),
    handleInputErrores,
    AuthController.upadatePasswordWithToken
);

export default router;
