const router = require("express").Router();
const{findnotpaysetpayfield}=require("../controler/findnotpay")

router.get("/findpaynot", (req, res) => {
    
    findnotpaysetpayfield(req,res);
   })
   router.get("/list", (req, res) => {
    res.render("functions", {})
   })
   

module.exports = router