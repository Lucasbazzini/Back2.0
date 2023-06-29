import CartsModel from '../models/carts.model.js';
import ProductsModel from '../models/products.model.js';

class CartManager {
  constructor() {
    this.cartModel = CartsModel;
    this.productModel = ProductsModel;
  }

  createCart = async () => {
    try {
      const newCart = await this.cartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`);
    }
  }

  getCart = async (cartId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error(`No se pudo recuperar el carrito: ${error.message}`);
    }
  }

  addToCart = async (cartId, productId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      if (!productId) {
        throw new Error('El ID del producto es necesario');
      }
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      const existingProduct = cart.products.find((product) => product.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ productId: productId, quantity: 1 });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`No se pudo agregar el producto al carrito: ${error.message}`);
    }
  }

  removeFromCart = async (cartId, productId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      if (!productId) {
        throw new Error('El ID del producto es necesario');
      }
      const existingProduct = cart.products.find((product) => product.productId === productId);
      if (!existingProduct) {
        throw new Error('Product not found in cart');
      }
      existingProduct.quantity -= 1;
      if (existingProduct.quantity === 0) {
        cart.products = cart.products.filter((product) => product.productId !== productId);
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito : ${error.message}`);
    }
  }

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      if (!productId) {
        throw new Error(' El ID del producto es necesario');
      }
      const existingProduct = cart.products.find((product) => product.productId === productId);
      if (!existingProduct) {
        throw new Error('Producto no encontrado en el carrito');
      }
      if (!quantity) {
        throw new Error('La cantidad es necesaria');
      }
      if (quantity <= 0) {
        throw new Error('La cantidad no puede ser negativa');
      }
      existingProduct.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
    }
  }

  emptyCart = async (cartId) => {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al vaciar el carrito : ${error.message}`);
    }
  }

  deleteCart = async (cartId) => {
    try {
      const cart = await this.cartModel.findByIdAndDelete(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
    } catch (error) {
      throw new Error(`Error para eliminar el carrito : ${error.message}`);
    }
  }
}

export { CartManager };