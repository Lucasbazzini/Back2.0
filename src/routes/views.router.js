import { Router } from "express";
import { ProductManager } from '../dao/managers/products.manager.js';
const router = Router();

router.get('/',async (req,res)=>{
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render('home', {title: 'Mostrando productos', style: 'product.css', products: products});
})

router.get('/realtimeproducts', (req,res)=>{
    res.render('realTimeProducts', {title: 'Mostrando productos en tiempo real', style: 'productList.css'});
})

router.get('/webchat', (req,res)=>{
    res.render('chat', { style: 'chat.css', title: 'ChatBox'});
})

export default router;