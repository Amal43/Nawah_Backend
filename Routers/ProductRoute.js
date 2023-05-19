const express = require('express')
const User=require('../Models/product');
const route=express.Router();
const path=require('path');


route.post('/product',async function(req,res)
{
    let userRegister= await User.create({
    username:req.body.username,
    password:req.body.password,
});
if(userRegister)
    {
    let pathfile=path.join(__dirname,"../Front/login.html");
    res.sendFile(pathfile);
    }
    else
    {
        res.status(404).send('not found');
    }    
})