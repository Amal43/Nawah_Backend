const express = require("express");
const Route = express.Router();
const Farmer = require("../Models/farmer");
const path = require("path");
const multer = require("multer");
const Jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const key = "keystring";
const bodyParser = require("body-parser");
Route.use(bodyParser.json());
Route.use(cookieParser());
Route.use(express.static("./uploads"));
const bcryptjs = require('bcryptjs')
const bcrypt = require('bcrypt')

let diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let fileUpload = multer({ storage: diskStorage });


// ======================== farmer register================================//
//======================================================================================//

Route.post(
  "/register",
  fileUpload.single("img"),
  bodyParser.urlencoded({ extended: false }),
  async function (req, res) {
    let FarmerRegistration = await Farmer.create({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      address: req.body.address,
      farmaddress: req.body.farmaddress,
      farmarea: req.body.farmarea,
      cropamount: req.body.cropamount,
      croptype: req.body.croptype,
      farmingExperience: req.body.farmingExperience,
      img: req.file.filename,
    });
    if (FarmerRegistration) {
      res.status(200).json({
        message: 'user signed-up successfully',
        success: true
      });

    } else {
      res.status(400).json({
        message: 'The user not found',
        success: false
      });
    }
  }
);
// ======================== farmer login ================================//
//======================================================================================//

Route.post("/login", async function (req, res) {
  let farmerinfo = req.body
  let farmerlogin = await Farmer.findOne({email: farmerinfo.email})
  if (farmerlogin) {
      const isValidPassword = bcrypt.compare(
          farmerinfo.password, farmerlogin.password);   
      if (isValidPassword) {
          let token = Jwt.sign(farmerlogin.email, 'key')
          console.log(token)
          res.cookie('token', token, { maxAge: 360000 });
          res.status(200).json({
              message: 'user Authenticated and logged in successfully',
              success: true,
              token:token,
              data:farmerlogin
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

// ======================== all farmer================================//
//======================================================================================//

Route.get("/allfarmar", async (req, res) => {
  try {
    const data = await Farmer.find({});
    res.status(200).json({
      message: "All farmers",
      data: data,
      success: true,
    });
  }
  catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
});

// ======================== update user dashboard================================//
//======================================================================================//
Route.put('/update/:id', async function (req, res) {

  let updateFarmer = await Farmer.findById(req.params.id).then((updateFarmer) => {
    updateFarmer.fname = req.body.fname,
      updateFarmer.lname = req.body.lname,
      updateFarmer.email = req.body.email,
      updateFarmer.password = req.body.password,
      updateFarmer.phone = req.body.phone,
      updateFarmer.address = req.body.address,
      // updateFarmer.img  = req.body.img
      updateFarmer.save()
  });
  res.json({
    message: "successfully added",
    status: 200,
    data: updateFarmer,
    success: true,
  });
})
// ======================== delete user================================//
//======================================================================================//
Route.delete('/del/:id', async function (req, res) {

  let deleteFarmer = await Farmer.deleteOne({ _id: req.params.id })
  if (deleteFarmer) {
    res.status(200).json({
      message: 'Farmar deleted successfully',
      success: true
    });
  }
  else {
    res.status(500).json({ success: false });
  }
})



// ======================== dashboard get farmer by id================================//
//======================================================================================//
Route.get("/:id", async function (req, res) {
  let data = await Farmer.findOne({ _id: req.params.id })
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
// ========================get one farmer================================//
//========================================================================//
Route.get('/getonefarmer/:token',  async function (req, res) {
  try {
    const token = req.params.token;
    const decodedToken = Jwt.verify(token, "key");
    const farmer = await Farmer.findOne({ email: decodedToken });

    if (farmer) {
      res.json({
        message: "Successfully Get Farmer",
        status: 200,
        data: farmer,
        success: true
      });
    } else {
      res.status(404).json({
        message: "Cannot Find Farmer",
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

// ========================edit farmer info in website by himself================================//
//========================================================================//
Route.put('/editfarmer/:token', fileUpload.single('img'), async (req, res) => {
  const token = req.params.token;
  const decoded = Jwt.verify(token, "key");
  const farmer = await Farmer.findOneAndUpdate(
    { email: decoded },
    {
      $set: {
        "fname": req.body.fname,
        "lname": req.body.lname,
        "email": req.body.email,
        "password": req.body.password,
        "phone": req.body.phone,
        "address": req.body.address,
        "farmaddress": req.body.farmaddress,
        "farmarea": req.body.farmarea,
        "cropamount": req.body.cropamount,
        "croptype": req.body.croptype,
        "farmingExperience": req.body.farmingExperience,
        "img" : req.body.img 
      },
    },
    { upsert: true },
    );
    if (!farmer) {
      res.status(404).json({
        error: "Farmer not found",
        success: false,
    });
    return;
  }

  res.json({
    message: "Successfully updated",
    data: farmer,
    success: true,
  });
});


// ========================add notes by engineer in farmer================================//
//========================================================================//
Route.put('/addnote/:id', async function (req, res) {

  console.log(req.body)
  let updateFarmer = await Farmer.findByIdAndUpdate(req.params.id,{$push:{notes:req.body}})
  res.json({
    message: "successfully added",
    status: 200,
    data: updateFarmer,
    success: true,
  });
})
module.exports = Route;

