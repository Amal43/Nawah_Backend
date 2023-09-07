const express = require('express');
const route = express.Router();
const Product = require('../Models/product');
const Farmer = require("../Models/farmer");
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const Jwt = require('jsonwebtoken');
const { verify } = require('crypto');
const key = "keystring";
const bodyParser = require('body-parser');
const { log } = require('console');
route.use(bodyParser.json());
route.use(cookieParser());
// route.use(express({urlencoded:{extends:true}}))
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
    storage: filestorage,
    fileFilter: multerFilter
})
//==============================add product dashboard=================================//
// ==========================================================================//
route.post('/addproduct', upload.single('img'), bodyParser.urlencoded({ extended: false }), async function (req, res) {

    console.log(req.file);
    let addproduct = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        quantity: req.body.quantity,
        status: req.body.status,
        imageUrl: req.file.filename
        // farmerId:info._id,
    });

    if (addproduct) {
        res.json({
            message: "Successfull added product",
            status: 200,
            data: addproduct,
            success: true,
        });
    }
    else {
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

route.get("/allfertilizer", async function (req, res) {
    const products = await Product.find({ category: "fertilizer" });
    res.json({
        message: "all fertilizer",
        status: 200,
        data: products,
        success: true,
    });
});


// ================================top rated ==============================//

route.get("/toprate", async function (req, res) {
    const products = await Product.find({})
        .sort({ rates: -1 }) // sort products by rating in descending order
        .limit(3); // limit the number of results to 10

    res.json({
        message: "Top rated products",
        status: 200,
        data: products,
        success: true,
    });
});

//==============================get product by id=================================//
// ==========================================================================//
route.get("/:id", async function (req, res) {
    let data = await Product.findOne({ _id: req.params.id })
    if (data) {
        res.json({
            message: "get product",
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

//==============================delete product by id=================================//
// ==========================================================================//
route.delete('/delprd/:id', async function (req, res) {

    let deletprd = await Product.deleteOne({ _id: req.params.id })
    if (deletprd) {
        res.json({
            message: "Successfully deleted",
            status: 200,
            data: deletprd,
            success: true,
        });
    }
    else {
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
route.put('/update/:id', upload.single('img'), async function (req, res) {
    try {
        console.log(req.file)
        // let x = req.files.filename
        // Find the product by its ID and update its properties
        let product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category,
                status: req.body.status,
                imageUrl: req.file.filename
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
});
//==============================update product by id by farmer in website=================================//
// ==========================================================================//
route.put('/updateee/:id', upload.single('img'), async function (req, res) {
    try {
        // let x = req.files.filename
        // Find the product by its ID and update its properties
        let product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category,
                status: req.body.status,
                imageUrl: req.body.imageUrl
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
});
//==============================add product by farmer in website=================================//
// ==========================================================================//

route.post('/addproductfarmer/:token', upload.single('imageUrl'), async function (req, res) {
    try {
        const token = req.params.token;
        console.log(token)
        const decodedToken = Jwt.verify(token, "key");
        const farmer = await Farmer.findOne({ email: decodedToken });

        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            quantity: req.body.quantity,
            status: req.body.status,
            imageUrl: req.file.filename,
            farmerId: farmer._id
        });
        if (product) {
            res.json({
                message: "Successfully added product",
                status: 200,
                data: product,
                success: true
            });
        } else {
            res.json({
                message: "Cannot add product",
                status: 400,
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            status: 500,
            success: false
        });
    }
});
// ====================get products add by farmer==================//
// ================================================================//
route.get("/farmerprd/:token", async function (req, res) {
    const token = req.params.token;
    console.log(token)
    const decodedToken = Jwt.verify(token, "key");
    const farmer = await Farmer.findOne({ email: decodedToken });
    console.log(farmer);
    let data = await Product.find({ farmerId: farmer?._id })
    if (data) {
        res.json({
            message: "get product",
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

module.exports = route;