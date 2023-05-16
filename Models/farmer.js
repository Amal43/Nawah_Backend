const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmerSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value && value.length >= 6;
      },
      message: 'Password must be at least 6 characters long'
    }
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
      type: String,
      required: true
  },
  farmaddress: {
    type: String,
    required: true
  },
  farmarea:{
    type: Number,
    required: true,
  },
  cropamount:{
    type: Number,
    required: true,
  },
  croptype:{
    type: String,
    required: true,
  },
  farmingExperience: {
    type: Number,
  },
  img:{
    type:String,
    required: true,
    default: "http://localhost:5000/default.png",
  },

  addProduct:{
    product: [{
      type: mongoose.Schema.Types.ObjectId,ref:'products',
      required: true
    }],
  }
});

const Farmer = mongoose.model('farmers', farmerSchema);

module.exports = Farmer;