import { Router } from 'express';
import {getProductsPlain} from '../controllers/productController.js';

export const router=Router()

router.get('/products', async (req,res)=>{
    const products = await getProductsPlain(req);
    res.render('home', { products });
})

router.get('/realtimeproducts', (req,res)=>{

    
    res.render('realtimeproducts', {});
})