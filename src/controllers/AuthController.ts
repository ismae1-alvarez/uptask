import type {Request, Response} from 'express'
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController{
    
    static createAccount = async(req:Request, res:Response)=>{
        try {
            const { password, email} =  req.body;

            const userExists =  await User.findOne({ email });

            if( userExists ) {
                const error = new Error('El usuario ya esta registrado');
                return res.status(409).json({error: error.message});
            };

            const user = new User(req.body);

            // Hash Password
            user.password = await  hashPassword(password); 

            // Generar el token
            const token = new Token();
            token.token = generateToken();
            token.user =  user.id;

            // Enviar email
            AuthEmail.sedConfirmationEmail({
                email: user.email, 
                name: user.email,
                token: token.token,
            })

                        
            await Promise.allSettled([user.save(), token.save()]);

            res.send('Cuenta creada, revisa tu email para confirmarla');

        } catch (error) {
            res.status(500).json({error :  'Hubo un error'});
        };
    };

    static confirmAccount = async(req:Request, res:Response)=>{
        try {
            const { token } = req.body;
            
            const tokenExists = await Token.findOne({ token });

            if(!tokenExists){
                const error = new Error('Token no valido');
                return res.status(404).json({error: error.message});
            };
            
            const user = await User.findOne(tokenExists.user);

            user.confirmed = true;

            await Promise.allSettled([await user.save(), tokenExists.deleteOne()])

            res.send('Cuenta verificada exitosamente!!');

        } catch (error) {
            res.status(500).json({error :  'Hubo un error'});
        };
    };

    static login = async(req:Request, res:Response)=>{
        try {
            const { email, password } = req.body;

            const user =  await User.findOne({ email });

            if(!user){
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({error: error.message});
            };

            if(!user.confirmed){

                const token = new Token();
                token.user =  user.id;
                token.token =  generateToken();

                await token.save();

                // Enviar el email
                AuthEmail.sedConfirmationEmail({
                    email: user.email, 
                    name: user.name,
                    token: token.token,
                })

                const error = new Error('La cuenta no ha sido confirmado, hemos enviado un e-mail de confirmacion');
                return res.status(401).json({error: error.message});
            };

            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password);

            if(!isPasswordCorrect){
                const error = new Error('Password incorrecto!!');
                return res.status(401).json({error: error.message});
            };
            
            res.send('Autenticado');
        } catch (error) {
            res.status(500).json({error :  'Hubo un error'});
        };
    };

    static requestConfirmationcode = async(req:Request, res:Response)=>{
        try {
            const { email} =  req.body;

            const user =  await User.findOne({ email });

            if( !user ) {
                const error = new Error('El usuario no esta registrado');
                return res.status(404).json({error: error.message});
            };

            if( user.confirmed ){
                const error = new Error('El usuario ya esta confirmado');
                return res.status(403).json({error: error.message});
            };

            // Generar el token
            const token = new Token();
            token.token = generateToken();
            token.user =  user.id;

            // Enviar email
            AuthEmail.sedConfirmationEmail({
                email: user.email, 
                name: user.email,
                token: token.token,
            })

                        
            await Promise.allSettled([user.save(), token.save()]);

            res.send('Se envio un nuevo token atu e-mail');

        } catch (error) {
            res.status(500).json({error :  'Hubo un error'});
        };
    };

};