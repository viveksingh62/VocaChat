const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter")
require('dotenv').config()
const PORT = process.env.PORT || 8080;
require("./models/dbConnection")
const cors  = require("cors")
app.use(cors())

app.get("/",(req,res)=>{
   res.send("server is running ")
})
app.use("/auth",authRouter)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})