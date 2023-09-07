const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // minlength: 2,
    // maxlength: 50
  },
  description: {
    type: String,
    // required: true,
    // minlength: 10,
    // maxlength: 500
  },
  price: {
    type: Number,
    // required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    // required: true,
    default: "http://localhost:5000/default.png"
  },
  category: {
    type: String,
    enum: ['dates','fertilizer', 'palm'],
    default: 'dates'
    // required: true
  },
  quantity:{
    type:Number,
    // required: true
  },
  
  status: {
    type: String,
    default: "pending",
    enum: {
        values: ['available','out of order','pending'],
    },
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,ref:'farmers'
  },
  rates:{
    type: Number ,
    default: 1
  }
})

const Product = mongoose.model('products', productSchema);


// Product.create({
//   name:"سماد طبيعي",
//   description:"Dellllllllllllllllll",
//   price:100888,
//   imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrAHbefcdV7YTM_b0uKsxKNGxphD5mgb5I0g&usqp=CAU",
//   category:"fertilizer",
//   quantity:10,
//   status:"available",
//   // farmerId:"5ee0e0e0e0e0e0e0e0e0e0e0"
// })


module.exports = Product;