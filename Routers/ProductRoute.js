const express = require('express');
const route=express.Router();
const Product=require('../Models/product');
const path=require('path');
const multer= require('multer');
const cookieParser = require('cookie-parser');
const Jwt = require('jsonwebtoken');
const { verify } = require('crypto');
const key= "keystring";
const bodyParser = require('body-parser');
route.use(bodyParser.json());
route.use(cookieParser());
route.use(express.static('./uploads'));

let filestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
let upload = multer({ storage:filestorage })

//==============================add product=================================//
// ==========================================================================//
route.post('/addproduct',upload.single('img'),bodyParser.urlencoded({extended:false }),async function(req,res)
{ 
    // let Token=Jwt.verify(req.cookies.token,key)
    // let info = await Product.findOne({username:Token})

    let addproduct= await Product.create({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        imageUrl:req.body.imageUrl,
        category:req.body.category,
        quantity:req.body.quantity,
        status:req.body.status,
        // farmerId:info._id,
    });

    if(addproduct)
    {
        res.json({
            message: "Successfull added product",
            status: 200,
            data: addproduct,
            success: true,
        });
    }
    else
    { 
        res.json({
            message: "can not add product",
            status: 400,
            data: exist,
            success: false,
        });
    }    
})

//==============================get all product=================================//
// ==========================================================================//
route.get("/allprd", async function (req, res) {
    const products = await Product.find({});
    res.json({
        message: "all product",
        status: 200,
        data: products,
        success: true,
    });
});

//==============================get product by id=================================//
// ==========================================================================//
route.get("/product:id", async function(req, res) {
    let data = await Product.findOne({_id:req.params.id})
    if(data){
        res.json({
            message: "get product",
            status: 200,
            data: data,
            success: true,
        });
    }
    else{
        res.json({
            message: "not exists",
            status: 400,
            data:  req.params.id,
            success: false,
        });
    }
})

//==============================delete product by id=================================//
// ==========================================================================//
route.delete('/delprd/:id',async function(req,res){

    let deletprd= await Product.deleteOne({_id:req.params.id})
    if(deletprd)
    {
        res.json({
            message: "Successfull deleted",
            status: 200,
            data: deletprd,
            success: true,
        });
    }
    else
    {
        res.json({
            message: "can not deleted",
            status: 400,
            data: exist,
            success: false,
        });
    }  
})


//==============================update product by id=================================//
// ==========================================================================//
route.put('/update/:id',async function(req,res)
{

    let updateprd= await Product.findByIdAndUpdate(req.params.id,req.body);
    if(updateprd)
    {
        res.json({
            message: "Successfull updated",
            status: 200,
            data: updateprd,
            success: true,
        });
    }
    else
    {
        res.json({
            message: "can not updated",
            status: 400,
            data: exist,
            success: false,
        });
    } 
})




module.exports=route;