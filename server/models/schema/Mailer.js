
require('dotenv').config();
const API_USER = process.env.API_USER ;
const API_PASS = process.env.API_PASS ;
const fromEmailAddress = process.env.FROMEMAILADRESS;
const nodemailer = require('nodemailer');
const templatemailreminders=require("../../templates/tempMail.json")


function sendone (req,res){
  /*console.log(req);
 console.log(templatemailreminders.Template.HtmlPart);
 console.log(typeof templatemailreminders.Template.HtmlPart);
 console.log(html);
*/
    var email=req.email;
    var daypayment=req.datepayment;
    var numergrave=req.id;
    var html= templatemailreminders.Template.HtmlPart.replace(/{{numergrave}}/g,numergrave).replace(/{{daypayment}}/g,daypayment);
  // ewentualnie link
 /* console.log(email);
  console.log(daypayment);
  console.log(numergrave);
   console.log('check data smtp');
    console.log(API_USER);
    console.log(API_PASS);
    console.log(templatemailreminders.Template.SubjectPart);
    console.log(templatemailreminders.Template.HtmlPart);*/
    
    const transporter = nodemailer.createTransport({
     
     host: "smtp.gmail.com.",
      port: 587,
      secure: false, 
      auth: {
        user: API_USER,
        pass: API_PASS
        
      }
    });

    transporter.sendMail({
      from: fromEmailAddress,
      to:email,
      subject: templatemailreminders.Template.SubjectPart,
      html:html
      
    },function(error, info){
      if(error){
        res.status(502);
        res.set('Content-Type', 'text/plain');
        res.send("Not send");
      }else{
        res.status(200);
        res.set('Content-Type', 'text/plain');
        res.send("OK");
        console.log('Message sent: ' + info.response);
      }
     
  });
 
  }

  module.exports={sendone};