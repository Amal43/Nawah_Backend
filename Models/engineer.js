const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const engineerSchema = new Schema({
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
  license:{
    // type:[String],
    // required: true,
  },
  role:
  {
      type:String,
      default:"engineer",
      enum:{
          values:["admin","user",'farmer','engineer'],
          message:'{VALUE} is not supported',
      }
  },
  farmers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'farmers'
  }]

});

const Engineer = mongoose.model('engineers', engineerSchema);
// Engineer.create({
//   fname:"Engineer",
//   lname:"User",
//   email:"eng@gmail.com",
//   password:"eng123",
//   phone:21255555555552,
//   address:"aswan",
//   role: "engineer"
// })
module.exports = Engineer;