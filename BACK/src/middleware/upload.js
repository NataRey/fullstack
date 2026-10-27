import multer from "multer";//manejar las cargas de archivos
import path from 'path'; // manipular extensiones y nombre de archivos
import fs from 'fs';

const storage = multer.diskStorage({
    destination: 'imagenes',

    filename:(req,file,cb)=>{
        const extension = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, extension).replace(/\s+/g,'-').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const uniqueName = `${nameWithoutExt}${timestamp}${extension}`;
        //mis-imagenes-202609031844000.jpg

        cb(null,uniqueName); 
    },
});

const storageUsers = multer.diskStorage({
    destination:(req, file, cb)=>{
        const dir = 'imagenes/usuarios';
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, {recursive:true});
        }
        cb(null , dir);
    },
    filename:(req, file , cb)=>{
        const extension = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, extension).replace(/\s+/g,'-').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const uniqueName = `${nameWithoutExt}${timestamp}${extension}`;
        cb(null,uniqueName);
    }
});

export const uploadSingleImage = multer({storage}).single('imagen');
export const uploadUserImage = multer({storage: storageUsers}).single('imagen');