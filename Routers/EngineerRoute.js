
const express = require('express');
const route=express.Router();
const Engineer=require('../Models/engineer');
const path=require('path');
const multer= require('multer');
const bcrypt= require('bcrypt')
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

// ======================== engineer register================================//
//======================================================================================//

route.post('/register',upload.single('img'),bodyParser.urlencoded({extended:false }),async function(req,res)
{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword; 

    let engineerRegister= await Engineer.create({
    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email,
    password:req.body.password,
    address:req.body.address,
    img:req.body.img,
    license:req.body.license,
    });

    if(engineerRegister)
    {
        res.json({
            message: "Successfull regestration go to sign in",
            status: 200,
            data:engineerRegister ,
            success: true,
        });
    }
    else
    {
        res.json({
            message: "email aready exist",
            status: 400,
            data: exist,
            success: false,
        });
    }    
})

//====================================engineer login====================================//
// ======================================================================================//
route.post('/login',async function(req,res)
{  
    const enginfo=req.body;
    const engineer= await Engineer.findOne({email:enginfo.email});
    
    if(engineer)
    { 
        const isValidPassword = bcrypt.compare(
            enginfo.password,
            engineer.password);
        if(isValidPassword){
            let token=Jwt.sign(engineer.email,key)
            // console.log(token)
            res.cookie('token',token, {maxAge: 360000});
            res.json({
                message: "Login Successfully",
                status: 200,
                success: true,
            });
        }  
    }
    else
    {
        res.json({
            message: "Error:invalid credentials , on account found",
            status: 401,
            data: req.body,
            success: false,
        });
    }    
});


// ==========================get all engineer================================//
//======================================================================================//
route.get('/getalleng',async function(req,res)
{
    let engineers= await Engineer.find({});
    res.json({
        message: "all engineers",
        status: 200,
        data: engineers,
        success: true,
    });
})

// ==========================delete================================//
//======================================================================================//

route.delete('/deleng/:id',async function(req,res){

    let deleteng= await Engineer.deleteOne({_id:req.params.id})
    if(deleteng)
    {
        res.json({
            message: "Successfull deleted",
            status: 200,
            data: deleteng,
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


// ==========================update================================//
//======================================================================================//

route.put('/updateeng/:id',async function(req,res)
{
    let updateng= await Engineer.findByIdAndUpdate(req.params.id,req.body);
    if(updateng)
    {
        res.json({
            message: "Successfull updated",
            status: 200,
            data: updateng,
            success: true,
        });
    }
    else
    {
        res.json({
            message: "can not update",
            status: 400,
            data: exist,
            success: false,
        });
    }  
})



module.exports=route;