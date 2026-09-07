import { Router } from "express";
import controllerProducts from "../controllers/controllerProducts.js";
import {uploadSingleImage } from '../middleware/upload.js';

const routerProducts = Router();
routerProducts.post('/', controllerProducts.createPorduct);
routerProducts.get('/:id', controllerProducts.readProductId);
routerProducts.get('/', controllerProducts.readProducts);
routerProducts.put('/:id', uploadSingleImage, controllerProducts.updateProduct);
routerProducts.delete('/:id', controllerProducts.deleteProduct);

export default routerProducts;