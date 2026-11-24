import { beforeEach, describe, expect, jest, test} from '@jest/globals';
import { json } from 'express';
//1. Simular Multer (uploadSingleImage )ejecuta el callback sin exigir elarchivo real
jest.unstable_mockModule('../src/middleware/upload.js', ()=>({

    uploadSingleImage: jest.fn((sol, res, callback)=> callback(null)), 
}));
const mockSave = jest.fn();
    const mockModelProducts = jest.fn().mockImplementation((datos)=>({
        ...datos,
        save: mockSave,
    }));
    mockModelProducts.find = jest.fn();
    mockModelProducts.findById = jest.fn();
    mockModelProducts.findByIdAndUpdate = jest.fn();
    mockModelProducts.findByIdAndDelete = jest.fn();

    jest.unstable_mockModule('../src/models/modelProducts.js', ()=>({
       default: mockModelProducts, 
    }));

    //2. Importamos dinamicamente todo
    const {uploadSingleImage} = await import('../src/middleware/upload.js');
    const { default: modelProducts} = await import ('../src/models/modelProducts.js');
    const { default: controllerProducts} = await import('../src/controllers/controllerProducts.js');

    describe('PRUEBA UNITARIA: controllerProducts', ()=>{
        beforeEach(() =>{
            jest.clearAllMocks();
        });

        //Prueba 1 readProducts find
        test('readProducts debe responder result: "fine" y la lista de productos', async()=>{
            // ARRANGE (preparar)
            const productosFalsos =[
                {_id: '1', modelo: 'Termos ecologico', precio: 25000, categoria: 'Termos'},
                {_id: '2', modelo: 'sombrilla', precio: 15000, categoria: 'sombrillas'},
            ];
            // programamos que devolvera mongoDB falso cuando llamen a find()
            modelProducts.find.mockResolvedValue(productosFalsos);
            const sol = {query: {}};
            const res = { json: jest.fn()};
            // ACT (actuar)
            await controllerProducts.readProducts(sol, res);
            //ASSERT (verificar)
            expect(modelProducts.find).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                result:'fine',
                message:'Products read',
                data: productosFalsos,
            });
        });

        // Prueba 2  readProducts (catch)
        test('readProducts debe responder result: "mistake" si falla la bd ', async()=>{
            //ARRANGE (preparar)
            const errorSimulado = new Error('Fallo de conexion a Mongo');
            modelProducts.find.mockRejectedValue(errorSimulado);
            const sol = {query: {}};
            const res = { json: jest.fn()};
            //ACT 
            await controllerProducts.readProducts(sol, res);
            //ASSERT
            expect(res.json).toHaveBeenCalledWith({
                result: 'mistake',
                message:'An error occurred reading the products',
                data: errorSimulado,
            });
        });

        // Prueba 3 readProductId (buscar por id)
        test('readID', async()=>{
            //ARRANGE
            const readId ={_id: 'id123', modelo: 'vaso', descripcion: 'vaso grande para la sala', precio: 32000,color:'gris',categoria: 'vasos', imagen:'vaso123.jpg'};
            modelProducts.findById.mockResolvedValue(readId);
            const sol = {params: {id: 'id123'}};
            const res = { json: jest.fn()};
            //ACT
            await controllerProducts.readProductId(sol,res);
            //ASSERT
            expect(modelProducts.findById).toHaveBeenCalledWith('id123');
            expect(res.json).toHaveBeenCalledWith({
                result:'fine',
                message: 'Product read',
                data: readId,
            });
        });
        //Prueba 4. Eliminar producto
        test ('deleteProductById', async ()=>{
            //Arrange (preparar)
            const deleteProductById = {_id: 'id555', modelo: 'vaso', descripcion: 'vaso grande'};
            modelProducts.findByIdAndDelete.mockResolvedValue (deleteProductById);
            const sol = {params: {id:'id555'}};
            const res = {json: jest.fn()};
            //Act (actuar)
            await controllerProducts.deleteProduct(sol, res);
            //ASSERT (verificar)
            expect(modelProducts.findByIdAndDelete).toHaveBeenCalledWith('id555');
            expect(res.json).toHaveBeenCalledWith({
                result: 'fine',
                message: 'Product deleted successfully',// Mismo mensaje del controlador
                data: 'id555',
            });
        });

        //Prueba 5 DeleteProducts (Catch)
        test('deleteProductById debe responder result: "mistake" si falla la bd', async()=>{
            //ARRANGE (preparar)
            const errorDelete = new Error('Fallo eliminando el producto');
            modelProducts.findByIdAndDelete.mockRejectedValue(errorDelete);
            const sol = {params: {id:'id556'}};
            const res = {json: jest.fn()};

            //ACT (actuar)

            await controllerProducts.deleteProduct(sol, res);

            //ASSERT (verificar)

            expect(res.json).toHaveBeenCalledWith({
                result: 'mistake',
                message: 'An error occurred deleting the product',
                data:errorDelete,
            });
        });

            //Prueba 6 Update products
            test('updateProductById debe actualizar y devolver un result: "fine"', async()=>{
                //ARRANGE (preparar)
                const productoViejo = {
                    _id:'abc123',
                    modelo:'vaso',
                    descripcion: 'un vaso muy increible para tu casa',
                    precio: 10000,
                    color: 'blanco',
                    categoria: 'vaso',
                    imagen: 'vaso123.jpg'
                };

                const productoNuevo = {
                    precio: 20000
                };

                const actualizacion = {
                    _id:'abc123',
                    modelo:'vaso',
                    descripcion: 'un vaso muy increible para tu casa',
                    precio: 20000,
                    color: 'blanco',
                    categoria: 'vaso',
                    imagen: 'vaso123.jpg'
                };

                modelProducts.findById.mockResolvedValue(productoViejo);
                modelProducts.findByIdAndUpdate.mockResolvedValue(actualizacion);

                const sol = {params: {id:'abc123'}, body:productoNuevo};
                const res = {json: jest.fn()};

                //ACT (actuar)
                await controllerProducts.updateProduct(sol, res);

                //ASSERT (validar)
                expect(res.json).toHaveBeenCalledWith({
                    result: 'fine',
                    message: 'product updated successfully',
                    data: actualizacion,
                });

            });
            // actualizar producto con imagen
        test('updateProductById debe actualizar un producto con imagen', async()=>{
            // ARRANGE
            const productoAnterior = {
                    _id: 'k102309',
                    modelo:'vaso',
                    descripcion: 'un vaso muy increible para tu casa',
                    precio: 20000,
                    color: 'blanco',
                    categoria: 'vaso',
                    imagen: 'vaso123.jpg'
                };
            const productoNuevo2 = {
                modelo:'vasoRoto',
                descripcion: 'un vaso muy increible para tu casa',
                precio: 20000,
                color: 'gris',
                categoria: 'vaso',
                };
            const imagenNueva = {
                filename: 'vasoabc.jpg'
            };
            const productoActualizado = {
                _id: 'k102309',
                ...productoNuevo2,
                imagen: imagenNueva.filename
            };
            modelProducts.findById.mockResolvedValue(productoAnterior);
            modelProducts.findByIdAndUpdate.mockResolvedValue(productoActualizado);
            const sol = {
                params: { id: 'k102309'},
                body: productoNuevo2,
                file: imagenNueva
            };
            const res = {
                json: jest.fn()
            };
            //ACT
            await controllerProducts.updateProduct(sol,res); 
            //ASSERT
            expect(modelProducts.findById).toHaveBeenCalledWith('k102309');
            expect(modelProducts.findByIdAndUpdate).toHaveBeenCalledWith('k102309', { ...productoNuevo2, imagen:'vasoabc.jpg'}, {new: true});
            expect(res.json).toHaveBeenCalledWith({
                result:'fine',
                message: 'product updated successfully',
                data: productoActualizado
            });

        })
    });

