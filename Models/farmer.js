const mongoose = require('mongoose');
const { Schema } = mongoose;

const farmerSchema = new Schema({
  fname: {
    type: String,
    // required: true
  },
  lname: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true,
    unique: true
  },
  password: {
    type: String,
  },
  phone: {
    type: Number,
    // required: true,
  },
  address: {
      type: String,
      // required: true
  },
  farmaddress: {
    type: String,
    // required: true
  },
  farmarea:{
    type: Number,
    // required: true,
  },
  cropamount:{
    type: Number,
    // required: true,
  },
  croptype:{
    type: String,
    // required: true,
  },
  farmingExperience: {
    type: Number,
  },
  img:{
    type:String,
    // required: true,
    default: "http://localhost:5000/default.png",
  },
  notes:{
    type:Array,
    default:[]
  },
  role:
  {
      type:String,
      default:"farmer",
      enum:{
          values:["admin","user",'farmer','engineer'],
          message:'{VALUE} is not supported',
      }
  },
  order:[{
    items: {
      type:Array,
    },
      totalPrice: {
      type: Number,
      // required: true
    },
      date: {
      type: Date,
      default: Date.now
    }
  }],
});

const Farmer = mongoose.model('farmers', farmerSchema);

// Farmer.create({
//   fname:"karemee",
//   lname:"Aliii",
//   email:"aaali@gmail.com",
//   password:"ali123",
//   phone:2122,
//   address:"aswan",
//   farmaddress:"aswan",
//   croptype:"Dates",
//   farmarea:555,
//   cropamount:555,
//   farmingExperience:555,
// })

module.exports = Farmer;