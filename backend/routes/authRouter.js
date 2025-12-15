const express = require("express")
const { googlelogin } = require("../controllers/authController")
const router = express.Router()

router.get("/test",(req,res)=>{
    res.send("test")

})
router.get("/google",googlelogin)

module.exports = router;