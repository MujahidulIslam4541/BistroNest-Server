const express=require('express')
const router=express.Router();
const {getReview, review}=require('../controllers/reviewController');
const { verifyToken } = require('../controllers/jwtController');

router.post('/reviews',verifyToken,review)
router.get('/reviews',getReview)
module.exports=router;