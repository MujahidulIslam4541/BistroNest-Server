import { stripPaymentIntent } from '../controllers/stripPaymentController';

const express=require('express')
const router=express.Router();

router.post('/create-payment-intent',stripPaymentIntent)


export default router;