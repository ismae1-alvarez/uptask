import { transporte } from "../config/nodemailer";


interface IEmail{
    email: string;
    name : string;
    token : string;
};

export class AuthEmail {
    constructor(
    ){};

    static sedConfirmationEmail = async(user : IEmail)=>{
        const info = await transporte.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject : 'UpTask - Confirma tu cuenta',
            text : 'UpTask - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, yas casi esta listo, solo debes de onfirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account"> Confirma cuenta</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    };

    static sendPasswordResetToken = async(user : IEmail)=>{
        const info = await transporte.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject : 'UpTask - Restablece tu password',
            text : 'UpTask - Restablece tu password',
            html: `<p>Hola: ${user.name}, has solicitado reestableces tu password.</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password"> Restablece Password</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    };
};