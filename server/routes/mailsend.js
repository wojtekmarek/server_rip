const router = require("express").Router();
const{sendone}=require("../models/schema/Mailer");

router.get("/sendsingle", (req, res) => {
    
    //sendone(req,res);
   })
   router.get("/sendsingleviaquater", (req, res) => {

    sendone(req.query,res);
   })

   module.exports = router