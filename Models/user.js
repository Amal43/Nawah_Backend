const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    // required: true,
  },
  img:{
    type:String,
    // required: true,
    default: "http://localhost:5000/default.png",
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
  role:
  {
      type:String,
      default:"user",
      enum:{
          values:["admin","user",'farmer','engineer'],
          message:'{VALUE} is not supported',
      }
  }
});

const User = mongoose.model('users', userSchema);

// User.create({
//   fname:"Amal",
//   lname:"Moussa",
//   email:"admin@gmail.com",
//   password:"admin123",
//   phone:2122,
//   address:"aswan",
//   totalPrice:555,
//   role: "admin"
// })
module.exports = User;