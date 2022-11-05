
require('dotenv').config();
const API_USER = process.env.API_USER ;
const API_PASS = process.env.API_PASS ;
const fromEmailAddress = process.env.FROMEMAILADRESS;
const nodemailer = require('nodemailer');
const templatemailreminders=require("../../templates/tempMail.json")

function sendone (req,res){
  console.log(req);
    var email=req.email;
    var daypayment=req.datapayment;
    var numergrave=req.idquater;
  // ewentualnie link
  console.log(email);
  console.log(daypayment);
  console.log(numergrave);
    console.log('check data smtp');
    console.log(API_USER);
    console.log(API_PASS);
    console.log(templatemailreminders.Template.SubjectPart);
    console.log(templatemailreminders.Template.HtmlPart);
    /*//res.status(500).send({ message: "Blad serwera wysyłki email" });
    const transporter = nodemailer.createTransport({
     
     host: "smtp.gmail.com.",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: API_USER,// API_USER, // generated ethereal user
        pass: API_PASS//API_PASS // generated ethereal password
        
      }
    });
    
    transporter.sendMail({
      from: fromEmailAddress,
      to:email,
      subject: templatemailreminders.Template.SubjectPart,
      html:templatemailreminders.Template.HtmlPart
      
    });
    */
  }

  module.exports={sendone};