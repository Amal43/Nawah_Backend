const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    email:{
        type:String
    },
    message:{
        type:String
    }

}, {
    timestamps: true, //add timestamps for createdAt and updatedAt fields
    versionKey:false,
    strict:false,
})
const Message= mongoose.model("message", MessageSchema )
module.exports = Message;