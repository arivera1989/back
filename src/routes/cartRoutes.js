import { Router } from 'express';
import { CartManager } from '../dao/CarritosManager.js';
import { isValidObjectId } from 'mongoose';
import {ProductManager} from '../dao/ProductosManager.js';

const router = Router();

router.post("/", async(req,res)=>{
    try {
        let nuevoCarrito = await CartManager.createCart()
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({nuevoCarrito})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`${error.message}`})
    }
});
router.get("/:cid", async(req,res)=>{
    let {cid}=req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de carrito ${cid} no es válido`})
    }

    try {
        let carrito = await CartManager.getCartById(cid)
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No hay carrito con el id ${cid}`})
        }
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({carrito})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`${error.message}`})
    }
});
router.post("/:cid/products/:pid", async(req,res)=>{
    let{cid, pid}=req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de carrito ${cid} no es válido`})
    }
    if(!isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de producto ${pid} no es válido`})
    }

    try {
        let carrito = await CartManager.getCartById(cid)
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No hay carrito con el id ${cid}`})
        }
        let producto = await ProductManager.getProductsBy({_id:pid})
        if(!producto){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No hay producto con el id ${pid}`})
        }
        let indiceProducto = carrito.products.findIndex(p=>p.product==pid)
        if(indiceProducto === -1){
            carrito.products.push({
                product: pid, quantity: 1
            })
        }else{
            carrito.products[indiceProducto].quantity ++
        }
        let carritoActualizado = await CartManager.updateCarrito(cid, carrito)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({carritoActualizado})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`${error.message}`})
    }
});
router.delete("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id de carrito ${cid} no es válido` });
    }
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `El id de producto ${pid} no es válido` });
    }

    try {
        // Obtener el carrito por el id
        let carrito = await CartManager.getCartById(cid);
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No hay carrito con el id ${cid}` });
        }

        // Buscar el índice del producto dentro del carrito usando el _id del producto
        let indiceProducto = carrito.products.findIndex(p => p.product._id.toString() === pid);

        if (indiceProducto === -1) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `El producto con el id ${pid} no se encuentra en el carrito` });
        }

        // Eliminar el producto del carrito
        carrito.products.splice(indiceProducto, 1);

        // Actualizar el carrito
        let carritoActualizado = await CartManager.updateCarrito(cid, carrito);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carritoActualizado });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${error.message}` });
    }
});
router.delete("/:cid", async(req,res)=>{
    let {cid}=req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de carrito ${cid} no es válido`})
    }

    try {
        let carrito = await CartManager.getCartById(cid)
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No hay carrito con el id ${cid}`})
        }
        let carritoEliminar = await CartManager.deleteCart(cid)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({carritoEliminar})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`${error.message}`})
    }
})
router.put("/:cid/products/:pid", async(req,res)=>{
    let{ cid, pid }=req.params
    let { quantity }=req.body
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de carrito ${cid} no es válido`})
    }
    if(!isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de producto ${pid} no es válido`})
    }
    if(isNaN(quantity)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`quantity debe ser un numero`})
    }

    try {
        let carrito = await CartManager.getCartById(cid)
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No hay carrito con el id ${cid}`})
        }
        let indiceProducto = carrito.products.findIndex(p => p.product._id.toString() === pid);
        if(indiceProducto === -1){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({ error: `No hay producto con el id ${pid} en el carrito` });
        }else{
            carrito.products[indiceProducto].quantity = quantity;
        }
        let carritoActualizado = await CartManager.updateCarrito(cid, carrito)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({carritoActualizado})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`${error.message}`})
    }
});
router.put("/:cid", async(req,res)=>{
    let{ cid }=req.params
    let { data }=req.body
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id de carrito ${cid} no es válido`})
    }
    if (!Array.isArray(data)) {
        return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un arreglo de objetos." });
    }
    const allValid = data.every(item => 
        typeof item === 'object' && 
        item !== null && 
        'product' in item && 
        'quantity' in item && 
        typeof item.product === 'string' &&
        typeof item.quantity === 'number' &&
        !isNaN(item.quantity) && 
        item.quantity >= 0
    );
    if (!allValid) {
        return res.status(400).json({
            error: "El arreglo de objetos debe contener propiedades 'product' (string) y 'quantity' (número válido)."
        });
    }
    try {
        let carrito = await CartManager.getCartById(cid)
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No hay carrito con el id ${cid}`})
        }
        const productPromises = data.map(item => ProductManager.getProductsBy({ _id: item.product }));
        const products = await Promise.all(productPromises);
        const invalidProducts = products.filter(product => !product);
        if (invalidProducts.length > 0) {
            const invalidIds = data.filter((item, index) => !products[index]).map(item => item.product);
            return res.status(400).json({ error: `No existen productos con los siguientes ids: ${invalidIds.join(', ')}` });
        }
        const carritoActualizado = await CartManager.updateCarrito(cid, data);
        return res.status(200).json({ carritoActualizado });
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`${error.message}`})
    }
});

export default router;
