import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import routerUsers from './routes/routerUsers.js';
import routerLogin from './routes/routerLogin.js';
import routerProducts from './routes/routerProducts.js';

const servidor = express();
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use('/users', routerUsers);
servidor.use('/inicio-sesion', routerLogin);
servidor.use('/products', routerProducts );
servidor.get('/',(solicitud, respuesta)=>{
    respuesta.status(404).send("No encontrado");
});

export default servidor;
