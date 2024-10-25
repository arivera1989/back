import { Router } from 'express';
import {getProductsPlain} from '../controllers/productController.js';

export const router=Router()

router.get('/', async (req,res)=>{
    const products = await getProductsPlain(req);
    res.render('home', { products });
})