import { Router } from 'express';
import { ProductManager } from '../dao/ProductosManager.js';
import { isValidObjectId } from 'mongoose';

const router = Router();

router.get("/", async(req,res)=>{
    let {limit, page, sort, category, stock}=req.query
    if(sort == "asc")
        sort = {price: 1}
    else if(sort == "desc"){
        sort = {price: -1}
    }else{
        sort = {}
    }

    let filters = {};

    if (category) {
        filters.category = category;
    }

    if (stock) {
        filters.stock = { $gte: 1 };
    }


    try {
        let productos = await ProductManager.getProducts(page, limit, sort, filters)
        let status
        if(productos){
            status = "success"
        }else{
            status = "error"
        }
        productos={
            status: status,
            payloads:productos.docs,
            ...productos
        }
        delete productos.docs

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({productos})
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({error: `${error.message}`})
    }
});
router.get("/:pid", async(req,res)=>{
    let {pid:id}=req.params
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `El ID ingresado no es válido`})
    }

    try {
        let producto = await ProductManager.getProductsxId(id)
        if (!producto) {
            return res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
        }
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({producto})
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({error: `${error.message}`})
    }
});
router.post("/", async(req, res) =>{
    let { title, description, code, price, status, stock, category, thumbnails}=req.body
    if(!title || !description || !code || !price || !category){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `Completa los datos obligatorios`})
    }
    try {
        let exite = await ProductManager.getProductsBy({code})
        if(exite){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error: `Ya existe un producto con el code: ${code}`})
        }

        let titulo = await ProductManager.getProductsBy({title})
        if(titulo){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error: `Ya existe un producto con el title: ${title}`})
        }

        let ultimoid = await ProductManager.getProductsId()
        let nuevoid = ultimoid +1
        let nuevoProducto = await ProductManager.createProducts({nuevoid, title, description, code, price, status, stock, category, thumbnails})
        res.setHeader('Contect-Type','application/json');
        return res.status(201).json({nuevoProducto});
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({error: `${error.message}`})
    }

});
router.put("/:pid", async(req, res) =>{
    
    let {pid:id}=req.params
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `El ID ingresado no es válido`})
    }

    if (Object.keys(req.body).length === 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Debes enviar al menos un parámetro en el cuerpo de la solicitud` });
    }

    let modificacion = req.body

    try {
        let productoModificado=await ProductManager.updateProduct(id, modificacion)
        if (!productoModificado) {
            return res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({productoModificado})
         
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({error: `${error.message}`})
    }


});
router.delete("/:pid", async(req,res)=>{
    let {pid:id}=req.params
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `El ID ingresado no es válido`})
    }

    try {
        let productoEliminado= await ProductManager.deleteProduct(id)
        if (!productoEliminado) {
            return res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
        }
        res.setHeader('Content-type', 'application/json');
        return res.status(200).json({productoEliminado});
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({error: `${error.message}`});
    }
});

export default router;
