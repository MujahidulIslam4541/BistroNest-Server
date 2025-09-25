const express=require('express')
const router=express.Router();
const {postCart, getCart, deleteCart}=require('../controllers/cartController')


// POST route to add item
router.post('/cart',postCart);

// GET route to get all items
router.get('/carts',getCart)

// DELETE cart item
router.delete('/cart/:id',deleteCart)
module.exports=router;