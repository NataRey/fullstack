import modelUser from "../models/modelUser.js";
import {generarToken, verificarToken} from "../ayudas/funciones.js";
import bcrypt from "bcryptjs";

const controllerLogin = {
    iniciarSesion: async(sol, res)=>{
        try {
            const{username, password}=sol.body;
            const userFound = await modelUser.findOne({
                email: username,
            });

            const contraseniaValidada = await bcrypt.compare(password, userFound.password);

            if(contraseniaValidada){
                const token = await generarToken({
                    id: userFound._id,
                    name: userFound.name
                });
                res.json({
                    result: 'fine',
                    message: `Successful access welcome ${userFound.name}`,
                    data: token,
                });
            }else{
                res.json({
                    result: 'mistake',
                    message: 'Access denied',
                    data: null,
                });
            }
            
        } catch (error) {
                res.json({
                    result: 'mistake',
                    message: 'An error ocurred during the user login',
                    data: error,
                });
        }
    },

    validarToken: async(sol, res)=>{
        try {
            const token = sol.params.token;
            const decodificado = await verificarToken(token);

            if(decodificado && decodificado.id){
                res.json({
                    result: 'fine',
                    message: 'token valid',
                    data: decodificado,
                });
            }else{
                res.json({
                    result: 'mistake',
                    message: 'invalid token',
                    data: null,
                });
            }
        } catch (error) {
            res.json({
                    result: 'mistake',
                    message: 'Ocurred mistake invalid token',
                    data: error,
                });
        }
    }
};

export default controllerLogin;
