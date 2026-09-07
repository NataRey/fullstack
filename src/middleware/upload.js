import multer from "multer";//manejar las cargas de archivos
import path from 'path'; // manipular extensiones y nombre de archivos

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

export const uploadSingleImage = multer({storage}).single('imagen');