import { carritosModelo } from "./models/carritos.model.js";

export class CartManager {
  static async createCart() {
    try {
      let carritoNuevo = await carritosModelo.create({ products: [] });
      return carritoNuevo.toJSON();
    } catch (error) {
      console.error("Error al crear el carrito", error);
    }
  }

  static async getCartById(id) {
    try {
      return await carritosModelo.findById(id).populate("products.product");
    } catch (error) {
      console.error(`Error al cargar el carrito con id ${id}, ${error}`);
    }
  }

  static async updateCarrito(id, carrito) {
    try {
      return await carritosModelo.findByIdAndUpdate(id, carrito, { new: true }).populate("products.product");
    } catch (error) {
      console.error(`Error al cargar el carrito con id ${id}, ${error}`);
    }
  }

  static async deleteCart(id) {
    try {
     return await carritosModelo.findByIdAndDelete(id).lean()
    } catch (error) {
     console.error("Error al eliminar productos:", error);
    }
 }
}
/*
export const createCart = async (req, res) => {
    const newCart = CartManager.createCart();
    await CartManager.saveCarts();
    res.status(201).json(newCart);
};

export const getCartById = async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = CartManager.findCart(cartId);
    if (!cart) {
        return res.status(404).json({ error: `Carrito con id ${cartId} no encontrado.` });
    }
    res.status(200).json(cart.products);
};

export const addProductToCart = async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = CartManager.addProductToCart(cartId, productId);
    if (!cart) {
        return res.status(404).json({ error: `Carrito con id ${cartId} no encontrado.` });
    }
    await CartManager.saveCarts();
    res.status(200).json(cart.products);
};
*/
