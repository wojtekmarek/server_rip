const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const PaymentSchema= new mongoose.Schema({
    
    Title:{type: String , enum:["Intencja","Kwatera","Usługa"], required:true},
    Status:{type: String , enum:["Utworzona","Oczekująca na płatność","Opłacona"], required:true},
    Date_payment:{ type: Date, required: true},
    Amount:{type:Number,require:true},
    Payfor:{type: String , required:true},
    created_at: { type: Date, required: true, default: Date.now }


   })
   const Payment = mongoose.model("Payment", PaymentSchema);

   const PaymentController={
    createnew:function(req,res){
      var payment= new Payment()
      payment.Title=req.Title;
    payment.Status=req.Status;
    payment.Amount=req.Amount;
    payment.Date_payment=new Date();
    payment.created_at=new Date;      
      payment.save((err, doc) => {
      if (!err) {
      res.redirect("/payment/list")
      } else {
      console.log("Błąd podczas tworzenia platnosci: " + err)
      }
      })
    },
    showlist:function (req,res){
        Payment.find((err, docs) => {
            if (!err) {
              docs.forEach(element => {
                element.Date=element.Date_payment.toISOString().slice(0,10).split("-").reverse().join("-");
              });
    
               console.log(docs);
                 res.render("listpayment", {
                 list: docs,
                 
                 });
                
               
            } else {
            console.log("Błąd pobierania danych /payment/list" + err)
            }
            })
       },
   };
   module.exports={Payment,PaymentSchema,PaymentController}