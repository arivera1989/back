import { Router } from 'express';
import {ProductManager} from '../dao/ProductosManager.js';

export const router=Router()

router.get('/products', async (req,res)=>{
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
        let {docs:products, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage} = await ProductManager.getProducts(page, limit, sort, filters)
        res.render('home', { products,
                            totalPages,
                            hasNextPage,
                            hasPrevPage,
                            nextPage,
                            prevPage
                            });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({error: `${error.message}`})
    }
})

router.get("/", async(req,res)=>{
    try {
        let products = await ProductManager.getProducts()
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({products})
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(500).json({error: `${error.message}`})
    }
});

router.get('/realtimeproducts', (req,res)=>{

    
    res.render('realtimeproducts', {});
})