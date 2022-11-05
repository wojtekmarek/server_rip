const router = require("express").Router();
const{sendone}=require("../models/schema/Mailer");

router.get("/sendsingle", (req, res) => {
    
    //sendone(req,res);
   })
   router.get("/sendsingleviaquater", (req, res) => {
    console.log(req.query);
    var reqone={};
    reqone.idquater=req.query.id;
    reqone.email=req.query.email;
    reqone.datapayment=req.query.datepayment;
    console.log(reqone);
    sendone(reqone,res);
   })

   module.exports = router