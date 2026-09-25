import {uploadSingleImage} from '../middleware/upload.js';
import modelProducts from '../models/modelProducts.js';
import fs from 'fs';
import path from 'path';

const controllerProducts = {
    createPorduct: async (sol,res)=>{
        try {
            uploadSingleImage(sol, res, async(error)=>{
                if(error){
                    res.json({
                    result: 'mistake',
                    message: 'An error occurred while upload the image',
                    data: error,
                    });
                }

                const newProduct = new modelProducts({
                    modelo: sol.body.modelo,
                    descripcion: sol.body.descripcion,
                    precio: sol.body.precio,
                    color: sol.body.color,
                    imagen: sol.file.filename
                });

                const savedProduct = await newProduct.save();

                    res.json({
                    result: 'fine',
                    message: 'Product created',
                    data: savedProduct,
                    });
            });
        } catch (error) {
                    res.json({
                    result: 'mistake',
                    message: 'An error occurred creating the product',
                    data: error,
                    });
        }
    },

    readProductId : async (sol, res)=>{
        try {
            const productFound = await modelProducts.findById(sol.params.id);

            if(productFound._id){
                res.json({
                    result: 'fine',
                    message: 'Product read',
                    data: productFound,
                });
            }
        } catch (error) {
            res.json({
            result: 'mistake',
            message: 'An error occurred reading the product by Id',
            data: error,
            });
        }
    }, 

    readProducts: async (sol, res)=>{
        try {
            const allProductsFound = await modelProducts.find();
                res.json({
                    result: 'fine',
                    message: 'Products read',
                    data: allProductsFound,
                });

        } catch (error) {
            res.json({
            result: 'mistake',
            message: 'An error occurred reading the products',
            data: error,
            });
        }
    },

updateProduct: async (sol, res) => {
    try {
        const { id } = sol.params;

  
        const productExistente = await modelProducts.findById(id);

        if (!productExistente) {
 
            if (sol.file) {
                fs.unlinkSync(sol.file.path);
            }

            res.json({
                result: 'mistake',
                message: 'product not found',
                data: null,
            });
        }

        if (sol.file) {
            if (productExistente.imagen) {
                const rutaImagenAntigua = path.join('imagenes', productExistente.imagen);

                if (fs.existsSync(rutaImagenAntigua)) {
                    fs.unlinkSync(rutaImagenAntigua);
                }
            }
        }

        const nuevosDatos = {
            modelo: sol.body.modelo,
            descripcion: sol.body.descripcion,
            precio: sol.body.precio,
            color: sol.body.color,
            imagen: sol.file ? sol.file.filename : productExistente.imagen,
        };

        const productoActualizado = await modelProducts.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true }
        );

        return res.json({
            result: 'fine',
            message: 'product updated successfully',
            data: productoActualizado,
        });

    } catch (error) {
        res.json({
            result: 'mistake',
            message: 'An error occurred updating the product',
            data: error.message || error,
        });
    }
},

deleteProduct : async (sol, res)=>{
    try {
        const productDelete = await modelProducts.findByIdAndDelete(sol.params.id);

        if(!productDelete){
            res.json({
            result: 'mistake',
            message: 'Product not found',
            data:null,
        });
        }
        if(productDelete.imagen){
            const rutaImagen = path.join('imagenes', productDelete.imagen);

            if(fs.existsSync(rutaImagen)){
                fs.unlinkSync(rutaImagen);
            }
        }
        res.json({
            result: 'fine',
            message: 'Product deleted successfully',
            data:productDelete._id,
        });

    } catch (error) {
        res.json({
            result: 'mistake',
            message: 'An error occurred deleting the product',
            data:error,
        });
    }
}

}

export default controllerProducts;