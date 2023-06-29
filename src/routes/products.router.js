import { Router } from "express";
import { productsUpdated } from "../utils/socketUtils.js";
import { ProductManager } from "../dao/managers/products.manager.js";
import uploader from '../utils/multer.js';

const productManager = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    try {
        const {limit} = req.query;
        const products = await productManager.getProducts(limit);
        res.send({status: 1, products: products});
    } catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId)
        res.send({status: 1, product: product});
    } catch (error) {
        res.status(404).send({status: 0, msg: error.message});
    }
});

router.post('/', uploader.array('thumbnails'), async (req, res) => {
    try {
        const newProductFields = req.body;
        const files = req.files;
        const filesUrls = files.map(file => `http://localhost:8080/files/uploads/${file.filename}`);
        newProductFields.thumbnails = filesUrls;        
        const newProduct = await productManager.addProduct(newProductFields);
        productsUpdated(req.app.get('io'));
        res.send({status: 1, msg: 'Producto agregado', product: newProduct});
        } catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProductFields= req.body;

        if (Object.keys(req.body).length === 0) throw new Error('Cuerpo de solicitud vacío');
        const updatedProduct = await productManager.updateProduct(productId, updatedProductFields);
        productsUpdated(req.app.get('io'));
        res.send({status: 1, msg: 'Producto actualizado', product: updatedProduct});
    } catch (error) {
        res.status(404).send({status: 0, msg: error.message});
    }
});

router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        await productManager.deleteProduct(productId);
        productsUpdated(req.app.get('io'));
        res.send({status: 1, msg: 'Producto eliminado'});
    } catch (error) {
        res.status(404).send({status: 0, msg: error.message});
    }
});

export default router;