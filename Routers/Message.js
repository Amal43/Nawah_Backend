const express = require('express');
const route = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Message = require('../Models/message');

route.post('/addmessage', async (req, res) => {
  const { email, message } = req.body;
  const x = await Message.create({ email, message });
  res.json({
    message: 'Message added successfully',
    status: 200,
    data: x,
    success: true,
  });
});

route.get("/allmessage", async function (req, res) {
  console.log('get all mesaages');
  const messages = await Message.find({});
  res.json({
      message: "all mesaages",
      status: 200,
      data: messages,
      success: true,
  });
})


module.exports = route;