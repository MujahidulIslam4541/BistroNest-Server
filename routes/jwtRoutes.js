const express=require('express');
const { jwtPost } = require('../controllers/jwtController');
const router=express.Router();

router.post('/jwt',jwtPost)

module.exports=router;