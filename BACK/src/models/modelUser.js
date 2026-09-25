import { Schema, model} from 'mongoose';
/** @type {*} */
const schemaUser = new Schema({
    name: {
        type: String, 
        required: true, 
        trim:true
    },
    email:{
        type: String, 
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/,"email invalido"]

        /** Expresion regular 
         * ^ inicio debe comenzar desde el primer caracter
         * [] conjunto de caracteres permitidos
         * a-zA-Z0-9._%+-
         * @ debe llevar @
         * a-zA-Z0-9.- dominio 
         * . concatena el punto
         * {2,8} extencion del dominio
         * $ fin aqui debe terminar el texto
         */


    },
    password:{
        type: String, 
        required: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,15}/, 'password invalido']
    }
});

export default model ('User', schemaUser);