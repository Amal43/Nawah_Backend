const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true, 
        min: 0,
        max: 5 
    },
    productId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
}, {
    timestamps: true, //add timestamps for createdAt and updatedAt fields
    versionKey:false,
    strict:false,
})
const Rates = mongoose.model("rates", rateSchema)
module.exports = Rates;