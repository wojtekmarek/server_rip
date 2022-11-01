const router = require("express").Router();
const{sendone}=require("../models/schema/Mailer");

router.get("/sendsingle", (req, res) => {
    sendone(req,res);
   })

   module.exports = router