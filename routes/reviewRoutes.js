const express=require('express')
const router=express.Router();
const {getReview}=require('../controllers/reviewController')

router.get('/reviews',getReview)
module.exports=router;