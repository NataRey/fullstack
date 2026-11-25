import { expect, jest } from '@jest/globals';
import request from 'supertest';

  // 1. Simulamos el modelo de Mongoose (soporta "new modelProducts()" y métodos estáticos)
  const mockSave = jest.fn();
  const mockModelProducts = jest.fn().mockImplementation((datos) => ({
      ...datos,
      save: mockSave,
  }));

  mockModelProducts.find = jest.fn();
  mockModelProducts.findById = jest.fn();
  mockModelProducts.findByIdAndUpdate = jest.fn();
  mockModelProducts.findByIdAndDelete = jest.fn();

  jest.unstable_mockModule('../src/models/modelProducts.js', () => ({
      default: mockModelProducts,
  }));
    // 2. Simulamos el middleware de subida de imágenes
const mockUploadSingleImage = jest.fn((req, res, cb) => {
    req.file = { filename: 'imagen_prueba.png' };
    cb(null);
});

const mockUploadUserImage = jest.fn((req, res, cb) => {
    req.file = { filename: 'usuario_prueba.png' };
    cb(null);
});

jest.unstable_mockModule('../src/middleware/upload.js', () => ({
    uploadSingleImage: mockUploadSingleImage,
    uploadUserImage: mockUploadUserImage,
}));

  // 3. Importar dinámicamente el modelo simulado y el servidor Express
  const { default: modelProducts } = await import('../src/models/modelProducts.js');
  const { default: servidor } = await import('../src/servidor.js');

describe('PRUEBA DE INTEGRACION: Rutas /products (Estilo postman)', ()=>{
        beforeEach(() =>{
            jest.clearAllMocks();
        });

        //prueba 1 GET/products
        test('GET / products status 200', async () =>{
            //ARRANGE 
            const productosMock =[
                {
                    _id: '6ae3fdb0fd19ce48e4bc9ab3',
                    modelo: "termos",
                    descripcion: "ideatermo ideal para bebidas calientes",precio: 25000,
                    color: "azul",
                    categoria: "termos",
                    imagen: "termos_pagweb_0520261030023339957.png"
                }
            ];
            modelProducts.find.mockResolvedValue(productosMock);
            //Act 
            const respuesta = await request(servidor).get('/products').send();
            //Assert
            expect(respuesta.statusCode).toBe(200);
            expect(respuesta.headers['content-type']).toMatch(/json/);
            expect(respuesta.body).toEqual({
                result:'fine',
                message: 'Products read',
                data:productosMock
            });
        });
        // prueba 2  GET /products/:id
        test('GET/products/:id', async ()=>{
            //ARRANGE
            const productoDetalle =
            {
                _id: '555', 
                modelo: 'agenda', 
                precio:1000
            };
            modelProducts.findById.mockResolvedValue(productoDetalle);
            //ACT
            const respuesta = await request(servidor).get('/products/555').send();
            //ASSERT
            expect(respuesta.statusCode).toBe(200);
            expect(respuesta.body.result).toBe('fine');
            expect(respuesta.body.data.modelo).toBe('agenda');
        });
        //Prueba 3 ruta inexistente 
        test('ruta inexistente', async ()=>{
            //act
            const respuesta = await request(servidor).get('/rutaFalsa');
            //assert
            expect(respuesta.statusCode).toBe(404);
        });

        // prueba 4 Delete product id
        test('DELETE/products/:id status 200', async()=>{
            //arrange
            const productoEliminado ={_id: '789', modelo: 'termo'};
            modelProducts.findByIdAndDelete.mockResolvedValue(productoEliminado);
            //act
            const respuesta = await request(servidor).delete('/products/789');
            //assert
            expect(respuesta.statusCode).toBe(200);
            expect(respuesta.body).toEqual({
                result: 'fine',
                message: 'Product deleted successfully',
                data:'789',
            });
        });
    });