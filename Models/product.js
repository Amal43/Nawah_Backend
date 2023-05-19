const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  description: {
    type: String,
    // required: true,
    minlength: 10,
    maxlength: 500
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
    // required: true
  },
 
  quantity:{
    type:Number,
    // required: true
  },
  
  status: {
    type: String,
    default: "available",
    enum: {
        values: ['available','out of order','pending'],
    },
    
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,ref:'farmers'
  }, 
}
})

const Product = mongoose.model('products', productSchema);

module.exports = Product;