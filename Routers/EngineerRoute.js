
const express = require('express');
const route=express.Router();
const Engineer=require('../Models/engineer');
const path=require('path');
const multer= require('multer');
const bcrypt= require('bcrypt')
const cookieParser = require('cookie-parser');
const Jwt = require('jsonwebtoken');
const { verify } = require('crypto');
const key = "keystring";
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

const multerFilter = function (req, file, cb) {
    if (file.mimetype.split("/")[0] == "image") {
        cb(null, true);
    } else {
        cb(new Error("Not image"), false);
    }
};
let upload = multer({
    storage:filestorage ,   
    fileFilter:multerFilter
    })
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
        img:req.file.filename,
        phone: req.body.phone,
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
    let enginfo=req.body;
    let engineer= await Engineer.findOne({email:enginfo.email});
    console.log(enginfo);
    if(engineer)
    { 
        const isValidPassword = bcrypt.compare(
            enginfo.password, engineer.password);
        if(isValidPassword){
            let token=Jwt.sign(engineer.email, "key")
            res.cookie('token',token, {maxAge: 360000});
            res.status(200).json({
                message: "Login Successfully",
                token:token,
                data: engineer,
                success: true,
            });
        }  
    }
    else
    {
        res.json({
            message: "Error:invalid credentials , on account found",
            status: 401,
            // data: req.body,
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

route.patch('/updateeng/:id',async function(req,res)
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
// ==========================dashboard get engineer by id==================================================//
//======================================================================================//
route.get("/:id", async function (req, res) {
    let data = await Engineer.findOne({ _id: req.params.id })
    if (data) {
        res.json({
            message: "get Engineer",
            status: 200,
            data: data,
            success: true,
        });
    }
    else {
        res.json({
            message: "not exists",
            status: 400,
            data: req.params.id,
            success: false,
        });
    }
})
// =======================get one engineer ==========================================//
//======================================================================================//
route.get('/getoneeng/:token',  async function (req, res) {
    try {
        // Get the token from the request parameters
        const token = req.params.token;

        // Verify the token
        const decodedToken = Jwt.verify(token, "key");

        // Find the engineer by email
        const engineer = await Engineer.findOne({ email: decodedToken });

            // Check if the engineer was found
            if (engineer) {
            // Send a 200 OK response with the engineer data
                res.json({
                    message: "Successfully Get engineer",
                    status: 200,
                    data: engineer,
                    success: true
                });
            } else {
            // Send a 404 Not Found response
                res.status(404).json({
                    message: "Cannot Find engineer",
                    status: 404,
                    success: false
                });
            }
        } catch (err) {
            // Log the error
            console.error(err);
            // Send a 500 Internal Server Error response
                res.status(500).json({
                    message: "Internal Server Error",
                    status: 500,
                    success: false
                });
        }
});
// ======================= get farmer =================================//
//========================================================================//
route.get("/getfarmer/:id",async function(req,res){
    let data = await Engineer.findOne({_id:req.params.id}).populate('farmers')
    if(data){
        res.json({
            message:"get Engineer",
            status:200,
            data: data,
            success: true,
        })
    }
    else{
        res.json({
            message:"not exists",
            status:400,
            data: req.params.id,
            success: false,
        })
    }
})
//================================================add farmer in enginer=================================================//
//===========================================================================================//
route.put('/add/:id', async function (req, res) {
    let updateFarmer = await Engineer.findByIdAndUpdate(req.params.id,{farmers:req.body.checkArray})
        console.log(updateFarmer)
    res.json({
        message: "successfully added",
        status: 200,
        data: updateFarmer,
        success: true,
    });
})
module.exports=route;