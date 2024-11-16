import { productosModelo } from "./models/productos.model.js";


export class ProductManager {
    static async getProducts(page=1, limit=10, sort= {}, filters= {}) {
        try {
            return productosModelo.paginate(filters, {limit, page, lean:true, sort})
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    static async getProductsBy(filtro={}) {
        try {
            return productosModelo.findOne(filtro).lean()
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    static async getProductsxId(id) {
        try {
            return await productosModelo.findById(id)
        } catch (error) {
            console.error(`Error al cargar producto con id ${id}, ${error}`);
        }
    }

    static async getProductsId() {
        try {
            return productosModelo.find().sort({ id: -1}).limit(1).lean()
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    static async createProducts(producto={}) {
        try {
            return await productosModelo.create(producto)
        } catch (error) {
            console.error("Error al guardar productos:", error);
        }
    }

    static async updateProduct(id, update) {
        try {
            return await productosModelo.findByIdAndUpdate(id, update, {new: true}).lean()
        } catch (error) {
            console.error("Error al actualizar productos:", error);
        }
    }

    static async deleteProduct(id) {
       try {
        return await productosModelo.findByIdAndDelete(id).lean()
       } catch (error) {
        console.error("Error al eliminar productos:", error);
       }
    }
}