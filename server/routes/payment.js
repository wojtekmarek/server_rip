const router = require("express").Router();
const {PaymentController}=require("../models/schema/Payment");

router.get("/checkpaymentid",(req,res)=>{
    console.log(req.query);
    PaymentController.checkpaymentid(req.query.Intention,res);
})
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
   router.post("/paypaymantnotyfication", (req, res) => {
    //console.log(req.body);
   PaymentController.notificationpayment(req.body,res);
   })

module.exports = router