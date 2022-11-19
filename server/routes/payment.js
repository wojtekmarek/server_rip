const router = require("express").Router();
const {PaymentController}=require("../models/schema/Payment");

router.get("/list", (req, res) => {
    
    PaymentController.showlist(req,res);
   })
router.get("/detail/:id",(req,res)=>{

    PaymentController.showdetail(req,res);
})
   router.post("/new", (req, res) => {
    console.log(req.body);
   PaymentController.createnew(req.body,res);
   })
   router.post("/paypaymant", (req, res) => {
    console.log(req.body);
   PaymentController.transacionsend(req.body,res);
   })

module.exports = router