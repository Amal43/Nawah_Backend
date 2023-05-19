require('./config/connect')
const cors  = require('cors')
const express = require('express')
const app = express()
const port = 3000



const userRoute=require('./Routers/UserRoute');
const engineerRoute=require('./Routers/EngineerRoute');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/User',userRoute);
app.use('/Engineer',engineerRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
