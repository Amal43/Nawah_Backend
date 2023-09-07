require('./config/connect')
const cors  = require('cors')
const express = require('express')
const app = express()
const port = 3500
const User=require('./Models/user');
const http = require('http')
const {Server} = require("socket.io")
const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET", "POST", "PATCH", "DELETE"],
    }
})
io.on("connection", (socket)=>{
    // console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        console.log(data,"rorororo")
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    });

    socket.on("send_message",(data)=>{
        console.log(data,"Dattdsa");
        socket.broadcast.to(data.room).emit("recieve_message", data);
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id)
    })
})


const userRoute=require('./Routers/UserRoute');
const engineerRoute=require('./Routers/EngineerRoute');
const productRoute=require('./Routers/ProductRoute');
const farmerRoute = require("./Routers/FarmerRoute");
const massage = require ("./Routers/Message");

app.use(express.static('./uploads'));
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/user",userRoute);
app.use('/Product',productRoute);
app.use('/Engineer',engineerRoute);
app.use("/Farmer", farmerRoute);
app.use("/massage", massage );


// app.get("/allusers", async (req, res) => {
//     try {
//       const data = await User.find({});
//       res.status(200).json({
//         message: "All users",
//         data: data,
//         success: true,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({
//         message: "Server error",
//         success: false,
//       });
//     }
//   });

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
