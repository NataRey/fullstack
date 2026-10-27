import modelUser from "../models/modelUser.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import fs from 'fs';

const DEFAULT_IMAGE = 'imagenes/usuarios/default-user.svg';

const ControllerUsers = {
    createUser: async(sol , res)=>{
        try{
            const {name, email, password, rol} = sol.body;
            const passwordProtected = await bcrypt.hash(password, 10);
            const rutaImagen = sol.file
            ? `imagenes/usuarios/${sol.file.filename}`
            : DEFAULT_IMAGE;
            const newUser = new modelUser({
                name,
                email,
                password: passwordProtected,
                imagen: rutaImagen,
                rol: rol || 'user'
            });
            console.log(newUser);

            const userCreate = await newUser.save();
            if(userCreate._id){
                res.json({
                    result: 'fine',
                    message: 'User created',
                    data: userCreate,
                });
            }
        }catch(error){
            if(sol.file && fs.existsSync(`imagenes/usuarios/${sol.file.filename}`)){
                fs.unlinkSync(`imagenes/usuarios/${sol.file.filename}`);
            }
            res.json({
                result: 'mistake',
                message: 'An error occurred while creating the user',
                data: error,
            });
        }
    },

    readUsers: async(sol , res)=>{
        try{
            const allUserFound = await modelUser.find();
            res.json({
                result: 'fine',
                message: 'Users found',
                data: allUserFound,
            })

        }catch(error){
            res.json({
                result: 'mistake',
                message: 'An error occurred while reading all users',
                data: error,
            });
        }
    },

    readUsersId: async(sol, res)=>{
        try {
            const userFound = await modelUser.findById(
                sol.params.id
            );
            if(userFound._id){
                res.json({
                result: 'fine',
                message: 'user found',
                data: userFound,
                });
            }
        } catch (error) {
                res.json({
                result: 'mistake',
                message: 'An error occurred while reading the user',
                data: error,
            });
        }
    },
    deleteUser: async(sol, res)=>{
        try{
            const userDelete = await modelUser.findByIdAndDelete(sol.params.id);
                if(userDelete._id){
                    if(userDelete.imagen && userDelete.imagen !== DEFAULT_IMAGE){
                        if(fs.existsSync(userDelete.imagen)){
                        fs.unlinkSync(userDelete.imagen);
                    }
                    }
                    
                    res.json({
                    result: 'fine',
                    message: 'User Delete',
                    data: null,
                });
            }
        }catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred while deleting the user',
                data: error,
            });
        }
    }, 
    updateUser : async (sol, res)=>{
        try {
             const dataToUpdate = { ...sol.body };
            if (dataToUpdate.password) {
                dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
            }
            if (sol.file) {
                const userActual = await modelUser.findById(sol.params.id);
                if(userActual && userActual.imagen && userActual.imagen !== DEFAULT_IMAGE){
                    if(fs.existsSync(userActual.imagen)){
                        fs.unlinkSync(userActual.imagen);
                    }
                }
                dataToUpdate.imagen = `imagenes/usuarios/${sol.file.filename}`;
            }
            
            const userUpdate = await modelUser.findByIdAndUpdate(
                sol.params.id,
                dataToUpdate,
                { new: true } 
            );
            if(userUpdate._id){
                res.json({
                    result: 'fine',
                    message: 'User Update',
                    data: userUpdate,
                });
            }
        } catch (error) {
            if(sol.file && fs.existsSync(`imagenes/usuarios/${sol.file.filename}`)){
                fs.unlinkSync(`imagenes/usuarios/${sol.file.filename}`);
            }
            res.json({
                result: 'mistake',
                message: 'An error occurred while updating the user',
                data: error,
            });
        }
    }
};

function generarContrasenaAleatoria(){
    return crypto.randomBytes(6).toString('hex');
}

export const forgotPassword = async (sol,res)=>{
    try{
        const {email}= sol.body;
        const user = await modelUser.findOne({email});
        if(!user){
             res.json({
                result: 'mistake',
                message: 'El correo ingresado no se encuentra en la base de datos',
                data: null,
            });
        }
        const newPass = generarContrasenaAleatoria();
        const hashPassword = await bcrypt.hash(newPass, 10);
        user.password = hashPassword;
        await user.save();

        const trasporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.EMAIL_NODE,
                pass: process.env.PASS_NODE
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_NODE,
            to: email,
            subject: 'Recuperacion de contraseña',
            text:`Hola ${user.name}, \n\n Tu nueva contraseña temporal es: ${newPass}\n\nRecuerda actualizar tu contraseña en tu perfil por seguridad. \n\n Saludos desde el área de soporte.`
        }

        await trasporter.sendMail(mailOptions);
        res.json({
                    result: 'fine',
                    message: 'Se ha enviado una nueva contraseña al correo registrado',
                });


    }catch(error){
        console.log('Error al generar contrasena ', error);
         res.json({
                result: 'mistake',
                message: 'Error interno en el servidor' , error: error.message,
            });
    }
}



export default ControllerUsers;
