import { Router } from "express";
import { ProductManager } from '../dao/managers/products.manager.js';
import { CartManager } from '../dao/managers/carts.manager.js';
const router = Router();

router.get('/',async (req,res)=>{
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render('home', {title: 'Mostrando los productos para servidor', style: 'product.css', products: products});
})

router.get('/realtimeproducts', (req,res)=>{
    res.render('realTimeProducts', {title: 'Mostrando los productos en tiempo real', style: 'productList.css'});
})

router.get('/webchat', (req,res)=>{
    res.render('chat', { style: 'chat.css', title: 'Este es nuestro WebChat!'});
})

router.get('/products', async (req,res)=>{
    try {
        const { limit = 10, page = 1, sort, category, available } = req.query;
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const productManager = new ProductManager();
        const products = await productManager.getProducts(limit, page, sort, category, available, baseUrl);
        res.render('productList', {title: 'Listado de productos!', style: 'productList.css', products: products});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/carts/:cartId', async (req,res)=>{
    try {
        const cartId = req.params.cartId;
        const cartManager = new CartManager();
        const cart = await cartManager.getCart(cartId);
        res.render('cart', {title: 'Carrito de compras!', style: 'cart.css', cart: cart});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

export default router;