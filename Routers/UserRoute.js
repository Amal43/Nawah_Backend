const express = require('express');
const route = express.Router();
const User = require('../Models/user');
const Rate = require('../Models/rate');
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const Jwt = require('jsonwebtoken');
const { verify } = require('crypto');
const key = "keystring";
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const Farmer = require("../Models/farmer");
const Product=require('../Models/product');


route.use(bodyParser.json());
route.use(cookieParser());
route.use(express.static('./uploads'));

let filestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
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

// ======================== user register===============================//
//====================================================================//
route.post('/register', upload.single('img'), bodyParser.urlencoded({ extended: false }), async function (req, res) {
    console.log(req.file)
    let userRegister = await User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        address: req.body.address,
        img: req.file.filename,
    });
    console.log(userRegister)
    if (userRegister) {
        res.status(200).json({
            message: 'user signed-up successfully',
            data: userRegister,
            success: true
        });

    }
    else {
        res.status(400).json({
            message: 'The user not found',
            success: false
        });
    }
})

// ======================== user login===============================//
//====================================================================//
route.post('/login', async function (req, res) {
    let userinfo = req.body
    let userlogin = await User.findOne({email: userinfo.email})
    if (userlogin) {
        const isValidPassword = bcrypt.compare(
            userinfo.password, userlogin.password);   
        if (isValidPassword) {
            let token = Jwt.sign(userlogin.email, 'key')
            console.log(token)
            res.cookie('token', token, { maxAge: 360000 });
            res.status(200).json({
                message: 'user Authenticated and logged in successfully',
                success: true,
                token:token,
                data:userlogin  
            });
        }
    }
    else {
        res.status(400).json({
            message: 'The user not found',
            success: false
        });
    }
});
// ======================== admin login for dashboard===============================//
//====================================================================//
route.post('/adminlogin',async function(req,res)
{  
    const admininfo=req.body;
    const admin= await User.findOne({$and:[{email:admininfo.email},{role:"admin"}]});
    
    if(admin)
    { 
        const isValidPassword = bcrypt.compare(
            admin.password,
            admin.password);
        if(isValidPassword){
            let token=Jwt.sign(admin.email,"key")
            res.json({
                message: "Login Successfully",
                token:token,
                data: admin,
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

// ======================== get all users===============================//
//====================================================================//
route.get("/allusers", async (req, res) => {
    try {
        const data = await User.find({});
        res.status(200).json({
            message: "All users",
            data: data,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
});

// ======================== update user ===============================//
//====================================================================//
route.put('/update/:id',upload.single('img'), async function (req, res) {
    console.log(req.body)
        try {
            console.log(req.file)
            // let x = req.files.filename
        // Find the product by its ID and update its properties
            let product = await User.findByIdAndUpdate(
                req.params.id,
                {
                    fname : req.body.fname,
                    lname : req.body.lname,
                    email : req.body.email,
                    password : req.body.password,
                    phone : req.body.phone,
                    address :req.body.address,
                    img  : req.file.filename    
                },
                { new: true } // Returns the updated product instead of the old one
            );
            res.json({
                message: 'Successfully updated the product',
                status: 200,
                data: product,
                success: true,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'An error occurred while updating the product',
                status: 500,
                success: false,
            });
        }
})
// ========================delete user ===============================//
//====================================================================//

route.delete('/del/:id', async function (req, res) {

    let deleteUser = await User.deleteOne({ _id: req.params.id })
    if (deleteUser) {
        res.status(200).json({
            message: 'user deleted successfully',
            success: true
        });
    }
    else {
        res.status(500).json({ success: false });
    }
})
// ======================== delete order ===============================//
//====================================================================//
route.delete('/delorder/:id', async function (req, res) {
    let deleteOrder = await Order.deleteOne({ _id: req.params.id })
    if (deleteOrder) {
        res.status(200).json({
            message: 'order deleted successfully',
            success: true,
        });
    }
    else {
        res.status(500).json({ success: false });
    }
})
// ======================== dashboard get user by id ===============================//
//====================================================================//
route.get("/:id", async function (req, res) {
    let data = await User.findOne({ _id: req.params.id })
    if (data) {
        res.json({
            message: "get Users",
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
// ======================== add rate ===============================//
//====================================================================//
route.put('/addrate/',async(req,res)=>
{
    console.log(req.body,"ugufufgy");
        const newRate= await Rate.create(req.body);
        console.log(newRate);
        const rate=await Rate.aggregate([{$match:{prodId:req.body.prodId}},{$group:{_id:'$prodId',rate:{$avg:'$rate'}}}]);
        console.log(rate);
        let ratedproduct=await Product.findOneAndUpdate({_id:rate[0]._id},{$set:{rates:rate[0].rate}},{new:true});
        // res.send(ratedproduct)
    
})
// ======================== add order ===============================//
//====================================================================//
route.post('/addorder/:token',async function(req,res)
{ 
    console.log('back order')
    const token=req.params.token;
    let decode=Jwt.verify(token,'key');
    console.log(decode ,"saasdsd")

    const mycart=req.body.item;
    console.log(mycart)

    let tot=  mycart.reduce((totalprice, item)=>totalprice+(item.tot),0)
    console.log(tot)
    // let tot=0;
    const user= await User.findOne({email:decode});
    const farmer= await Farmer.findOne({email:decode});
    // console.log(farmer)
    if(user)
    {
        let update= await User.findOneAndUpdate(
            { email:decode},
            { 
                $push:{
                    "order":[{
                        "items":mycart,
                        "totalPrice":tot,
                    }]
                }
            },
            {
                new:true
            }
        )
    }else{
        let update= await Farmer.findOneAndUpdate(
            { email:decode},
            { 
                $push:{
                    "order":{
                        "items":mycart,
                        "totalPrice":tot,
                    }
                }
            },
            {
                new:true
            }
        )
    }
    
})
// ======================== get one user===============================//
//====================================================================//
route.get('/getoneuser/:token',  async function (req, res) {
    try {
        const token = req.params.token;
        const decodedToken = Jwt.verify(token, "key");
        const user = await User.findOne({ email: decodedToken });
    
        if (user) {
            res.json({
                message: "Successfully Get User",
                status: 200,
                data: user,
                success: true
            });
        } else {
            res.status(404).json({
                message: "Cannot Find User",
                status: 404,
                success: false
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            success: false
        });
    }
});

// ======================== edit user in website by himself===============================//
//====================================================================//

route.put('/edituser/:token', upload.single('img'), async (req, res) => {
    const token = req.params.token;
    const decoded = Jwt.verify(token, "key");
    
    const user = await User.findOneAndUpdate(
        { email: decoded },
        {
            $set: {
            "fname": req.body.fname,
            "lname": req.body.lname,
            "email": req.body.email,
            "password": req.body.password,
            "phone": req.body.phone,
            "address": req.body.address,
            "img" : req.body.img 
            },
        },
        { upsert: true },
        );
        // console.log(req.body);
        
        if (!user) {
            res.status(404).json({
            error: "User not found",
            success: false,
        });
        return;
        }
    
        res.json({
        message: "Successfully updated",
        data: user,
        success: true,
    });
});
module.exports = route;