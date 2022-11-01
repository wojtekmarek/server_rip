const router = require("express").Router();

router.get("/sendsingle", (req, res) => {
    sendone(req,res);
   })