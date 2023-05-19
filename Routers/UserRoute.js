const express = require('express')
const User=require('../Models/user');
const route=express.Router();
const path=require('path');


route.post('/user',async function(req,res)
{
    let userRegister= await User.create({
    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email,
    password:req.body.password,
    phone:req.body.phone,
    address:req.body.address,
    // img:req.file.filename,
});
if(userRegister)
    {
    // let pathfile=path.join(__dirname,"../Front/login.html");
    // res.sendFile(pathfile);
    console.log("okay")
    }
    else
    {
        res.status(404).send('not found');
    }    
})


module.exports=route;