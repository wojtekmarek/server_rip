const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const returnUrlSuccessbackend = process.env.RETURN_URL_SUCCESS;
const shopId = parseInt(process.env.SHOP_ID );
const pblPrivateKey = process.env.PBL_PRIVATE_KEY;
const notifyURL = process.env.NOTIFYURL;
const crypto = require('crypto');
const axios = require('axios');
const { response } = require("../../server");
const res = require("express/lib/response");

const PaymentSchema= new mongoose.Schema({
    
    Title:{type: String , enum:["Intencja","Kwatera","Usługa"], required:true},
    Status:{type: String , enum:["Utworzona","Oczekująca na płatność","Opłacona"], required:true},
    Date_payment:{ type: Date, required: true},
    Amount:{type:Number,require:true},
    Intention:{type: Schema.Types.ObjectId, ref: 'IntentionShema'},
    GraveQuarters :{type: Schema.Types.ObjectId, ref: 'GraveQuartersSchema'},
    Order:{type: Schema.Types.ObjectId, ref: 'OrderSchema'},
    User:{type: Schema.Types.ObjectId, ref: 'UserSchema'},   
    Transacionid:{type: String,default:""}, 
    Signature:{type: String,default:""},
    created_at: { type: Date, required: true, default: Date.now }


   })
   const Payment = mongoose.model("Payment", PaymentSchema);

   const PaymentController={
    createnew:function(req,res){

      return new Promise((resolve, reject) => {
        var payment= new Payment()
      payment.Title=req.Title;
    payment.Status=req.Status;
    payment.Amount=req.Amount;
    payment.Date_payment=new Date();
    payment.created_at=new Date; 
    //switch za zo platność
    switch(req.Title){
      case "Intencja":
        payment.Intention=req.Intention;
      break;
      case "Kwatera":
        payment.GraveQuarters=req.GraveQuarters;
      break;
      case "Usługa":
          payment.Order=req.Order;
        break;
      default:console.log("something wrong with add payment");
    }     
      payment.save((err, doc) => {
           if (!err) {
             console.log(doc._id);
             resolve([true,doc._id]);
           } else {
           console.log("Błąd podczas dodawania platnosci: " + err)
           resolve([false,err]);
           }
           }) 
                   
              })
      
     
    },
    showlist:function (req,res){
        Payment.find((err, docs) => {
            if (!err) {
              docs.forEach(element => {
                element.Date=element.Date_payment.toISOString().slice(0,10).split("-").reverse().join("-");
                switch(req.Title){
                  case "Intencja":
                    element.For='<a class="btn btn-primary btn-sm" href="/intention/editview/'+element.Intention+'">Pokaż intencje</a>';
                  break;
                  case "Kwatera":
                    element.For='<a class="btn btn-primary btn-sm" href="/gravequarters/'+element.GraveQuarters+'">Edytuj</a>';
                  break;
                  case "Usługa":
                    element.For='in progress';
                    break;
                  default:console.log("something wrong with add payment");
                }     
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
       showdetail:function(req,res){
        Payment.findById(req.params.id, (err, doc) => {
       
          if (!err) {
           
            doc.Date=doc.Date_payment.getDate()+"-"+(doc.Date_payment.getMonth()+1)+"-"+doc.Date_payment.getFullYear()
            
           
           res.render("detailpayment",{
             Payment:doc,
             
          });
        }
          else{
            console.log("Błąd pobierania danych /payment/detail" + err)
          } });
        
       },
       deletepayment: async function(req,res)
            {  return new Promise((resolve, reject) => {
                    Payment.findOneAndRemove(req, (err, doc) => {
                      if (!err) {
                      resolve([true]);
                      } else {
                      console.log("Błąd podczas usuwania: " + err)
                      resolve([false,err]);
                      }
                      })
                      })
            },
        addtrasactionid:function(idpayment,idtransacion,userid,signature,url,res){
          Payment.findOneAndUpdate(
            { _id: idpayment },
            { 
              Status:"Oczekująca na płatność",       
              User:userid,   
              Transacionid:idtransacion,
              Signature:signature },
            (err, doc) => {
            if (!err) {
              res.redirect(url);
            } else {
            console.log("Błąd podczas aktualizowania danych: " + err)
            }
            }
            )
        },
        transacionsend: async function(req,res){
         /* console.log(returnUrlSuccessbackend);
          console.log(shopId);
          console.log(notifyURL);*/
         // console.log(pblPrivateKey);
            
            
            
            const transactionData = {
              shopId,
              price: parseFloat( req.Amount).toFixed(2),
              control: `Payment_id:"${req.Payment_id}"`,
              notifyURL:notifyURL,
              returnUrlSuccess:returnUrlSuccessbackend, 
              returnUrlSuccessTidPass: true
              
              
            };
            //haszowanie 
            const string = `${pblPrivateKey}|${Object.values(transactionData).join('|')}`;
           //console.log(string);
            const  signature= crypto.createHash('sha256')
            .update(string, 'utf-8').digest('hex');

            
            const transactionData1 = {
              shopId,
              price: parseFloat( req.Amount).toFixed(2),
              control: `Payment_id:"${req.Payment_id}"`,
              notifyURL:notifyURL,
              returnUrlSuccess:returnUrlSuccessbackend, 
              returnUrlSuccessTidPass: true,
              signature:signature
            };
        //  console.log(transactionData);
        //  console.log(transactionData1);
       //   console.log(signature);
          
            axios.post('https://secure.paybylink.pl/api/v1/transfer/generate',transactionData1, {
              headers: {
                'Content-Type': 'application/json'
            },             
              
              
          
          }).then(response => {
             
              console.log(response.data.transactionId);
              
              this.addtrasactionid(req.Payment_id,response.data.transactionId,req.User_id,signature,response.data.url,res);
             
                ///usunac nawias
                //zapis do bazy danych transacion id i przekierowanie na strone platnosci
          })
          /*
              if (transactionId) {
                fs.writeFileSync(`${uploadsPath}/${transactionId}`, 'registered');
                res.status(200).json({
                  transactionId,
                  url
                });
              } else {
                res.status(404).send('transaction went through but there was some other issue');
              }
            }, ({response}) => {
              console.log(`transaction for clientId: ${clientId} - ${response.status} ${response.statusText} `);
              res.status(response.status).send(response.statusText);
             
              
            })
          */
        
        },
      notificationpayment:function(req,res)
      {
        console.log(req.data);
        res.status(200);
        res.set('Content-Type', 'text/plain');
        res.send("OK");
     
      }

   };
   module.exports={Payment,PaymentSchema,PaymentController}