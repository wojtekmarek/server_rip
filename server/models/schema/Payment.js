const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const returnUrlSuccessbackend = process.env.RETURN_URL_SUCCESS;
const shopId = parseInt(process.env.SHOP_ID);
const pblPrivateKey = process.env.PBL_PRIVATE_KEY;
const notifyURL = process.env.NOTIFYURL;
const crypto = require('crypto');
const axios = require('axios');
const bcrypt = require("bcrypt")


const PaymentSchema = new mongoose.Schema({

  Title: { type: String, enum: ["Intencja", "Kwatera", "Usługa"], required: true },
  Status: { type: String, enum: ["Utworzona", "Oczekująca na płatność", "Opłacona", "Anulowana","Archiwalna"], required: true },
  Date_payment: { type: Date, required: true },
  Amount: { type: Number, require: true },
  Intention: { type: Schema.Types.ObjectId, ref: 'IntentionShema' },
  GraveQuarters: { type: Schema.Types.ObjectId, ref: 'GraveQuartersSchema' },
  Order: { type: Schema.Types.ObjectId, ref: 'OrderSchema' },
  User: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
  Transacionid: { type: String, default: "" },
  Signature: { type: String, default: "" },
  created_at: { type: Date, required: true, default: Date.now }


})
const Payment = mongoose.model("Payment", PaymentSchema);

const PaymentController = {
  setforwhatArchivestatus: function (req) {
    return new Promise((resolve, reject) => {
      console.log(req);
      switch (req) {
        case "Intencja":
          resolve("Intention");
          break;
        case "Kwatera":
          resolve("GraveQuarters");
          break;
        case "Usługa":
          resolve("Order");
          break;
        default: {
          console.log("somthing wron by set status archive chceck this");
          resolve("unnone");
        }
      }

    })
  },
  setArchivestatus: async function (forwhat,id) {
    console.log(forwhat);
    console.log(id);
    return new Promise((resolve, reject) => {
      this.setforwhatArchivestatus(forwhat)
        .then(what => {
          if (what !== "unnone") {
            let idsearch= ObjectId(id);
            Payment.findOneAndUpdate({[what]:idsearch},{Status:"Archiwalna"},(err)=>{
              if(!err){
                console.log("made");
                resolve(true);
              }else{
                console.log(err);
                resolve(false);
              }
            })
           }
          else {
            resolve(false);
          }

        })
    })
  },
  createnew: function (req) {

    return new Promise((resolve, reject) => {
      var payment = new Payment()
      payment.Title = req.Title;
      payment.Status = req.Status;
      payment.Amount = req.Amount;
      payment.Date_payment = new Date();
      payment.created_at = new Date;
      //switch za zo platność
      switch (req.Title) {
        case "Intencja":
          payment.Intention = req.Intention;
          break;
        case "Kwatera":
          payment.GraveQuarters = req.GraveQuarters;
          break;
        case "Usługa":
          payment.Order = req.Order;
          break;
        default: console.log("something wrong with add payment");
      }

      payment.save((err, doc) => {
        if (!err) {
          console.log(doc._id);
          resolve([true, doc._id]);
        } else {
          console.log("Błąd podczas dodawania platnosci: " + err)
          resolve([false, err]);
        }
      })

    })


  },
  showlist: function (req, res) {
    Payment.find((err, docs) => {
      if (!err) {
        docs.forEach(element => {
          element.Date = element.Date_payment.toISOString().slice(0, 10).split("-").reverse().join("-");
          /*switch (req.Title) {
            case "Intencja":
              element.For = '<a class="btn btn-primary btn-sm" href="/intention/editview/' + element.Intention + '">Pokaż intencje</a>';
              break;
            case "Kwatera":
              element.For = '<a class="btn btn-primary btn-sm" href="/gravequarters/' + element.GraveQuarters + '">Edytuj</a>';
              break;
            case "Usługa":
              element.For = 'in progress';
              break;
            default: console.log("something wrong with add payment");
          }*/
        });

        //console.log(docs);
        res.render("listpayment", {
          list: docs,

        });


      } else {
        console.log("Błąd pobierania danych /payment/list" + err)
      }
    })
  },
  setdoctosenddetail: function (doc) {
    return new Promise((resolve, reject) => {
      console.log(doc.Title);
      let docedit = {}
      docedit.Date = doc.Date_payment.getDate() + "-" + (doc.Date_payment.getMonth() + 1) + "-" + doc.Date_payment.getFullYear();
      docedit.createdat = doc.created_at.getDate() + "-" + (doc.created_at.getMonth() + 1) + "-" + doc.created_at.getFullYear();
      if(doc.Status!=="Archiwalna"&&doc.Status!=="Anulowana"){
        docedit.notarchive=true;
        docedit.payfor = "Intencji";
      docedit.payforlink = "/inten/editview/";
      docedit.payforvalue = doc.Intention.toString();
      switch (doc.Title) {
        case "Intencja":

          console.log(docedit);
          resolve(docedit);
          break;
        case "Kwatera":
          doc.payfor = "Kwatery";
          doc.payforlink = "/gravequarters/";
          doc.payforvalue = doc.Order;
          resolve(docedit);
          break;
        case "Usługa":
          doc.payfor = "Usługi";
          doc.payforlink = "/payment/list";
          doc.payforvalue = doc.Order;
          resolve(docedit);
          break;
        default: {
          doc.payfor = "Nieznany";
          doc.payforlink = "/payment/list";
          doc.payforvalue = "Nieznana";
          resolve(docedit);
        }
      }
      }else{
        docedit.notarchive=false;
        resolve(docedit);

      }
      


    })
  },
  showdetail: function (req, res) {
    Payment.findById(req.params.id, (err, doc) => {

      if (!err) {
        this.setdoctosenddetail(doc)
          .then(resolve => {
            console.log(resolve);
            res.render("detailpayment", {
              payment: doc,
              viewTitle: "Szczegóły płatności",
              paymentedit: resolve

            });
          })


      }
      else {
        console.log("Błąd pobierania danych /payment/detail" + err)
      }
    });

  },
  setstatuspayment: async function (id, status) {
    return new Promise((resolve, reject) => {
      
     console.log(id+","+status);
      Payment.findOneAndUpdate(
        { Intention:id },
        {
          Status: status,
          
        },
        (err, doc) => {
          if (!err) {
            resolve([true]);
          } else {
            console.log("Błąd podczas aktualizowania statusy płatności: " + err)
            resolve([false, err]);
          }
        }
      )
    })
  },
  deletepayment: async function (req, res) {
    return new Promise((resolve, reject) => {
      Payment.findOneAndRemove(req, (err, doc) => {
        if (!err) {
          resolve([true]);
        } else {
          console.log("Błąd podczas usuwania: " + err)
          resolve([false, err]);
        }
      })
    })
  },
  addtrasactionid: function (idpayment, idtransacion, userid, signature, url, res) {
    Payment.findOneAndUpdate(
      { _id: idpayment },
      {
        Status: "Oczekująca na płatność",
        User: userid,
        Transacionid: idtransacion,
        Signature: signature
      },
      (err, doc) => {
        if (!err) {
          res.send(url);
        } else {
          console.log("Błąd podczas aktualizowania danych: " + err)
        }
      }
    )
  },
  transacionsend: async function (req, res) {
    /* console.log(returnUrlSuccessbackend);
     console.log(shopId);
     console.log(notifyURL);*/
    // console.log(pblPrivateKey);



    const transactionData = {
      shopId,
      price: parseFloat(req.Amount).toFixed(2),
      // control: `Payment_id:"${req.Payment_id}"`,
      notifyURL: notifyURL,
      returnUrlSuccess: returnUrlSuccessbackend,
      returnUrlSuccessTidPass: true


    };
    //haszowanie 
    const string = `${pblPrivateKey}|${Object.values(transactionData).join('|')}`;
    //console.log(string);
    const signature = crypto.createHash('sha256')
      .update(string, 'utf-8').digest('hex');
    console.log(signature);

    const transactionData1 = {
      shopId,
      price: parseFloat(req.Amount).toFixed(2),
      // control: `Payment_id:"${req.Payment_id}"`,
      notifyURL: notifyURL,
      returnUrlSuccess: returnUrlSuccessbackend,
      returnUrlSuccessTidPass: true,
      signature: signature
    };
    //  console.log(transactionData);
    //  console.log(transactionData1);
    //   console.log(signature);

    axios.post('https://secure.paybylink.pl/api/v1/transfer/generate', transactionData1, {
      headers: {
        'Content-Type': 'application/json'
      },



    }).then(response => {

      //console.log(response.data.transactionId);

      this.addtrasactionid(req.Payment_id, response.data.transactionId, req.User_id, signature, response.data.url, res);


    })


  },
  setpaystatus: function (doc) {
    switch (doc.Title) {
      case "Intencja":
        const { IntentionController } = require("./Intention");
        IntentionController.setpaystatus(doc.Intention, true);

        break;
      case "Usługa":
        break;
      case "Kwatera":
        break;
      default: console.log("something wrong setstatus cant read title");
    }
  },
  notificationpayment: function (req, res) {

    /* //sprawdzenie sygnatury
     var transactionData={
       transactionId:req.transactionId ,
       control: req.control,
       email:req.email,
       amountPaid: req.amountPaid,
       notificationAttempt:req.notificationAttempt,
       paymentType: req.paymentType,
       apiVersion: req.apiVersion, 
           
     }
     bcrypt.compareSync("string",req.signature)
     var string = `${pblPrivateKey}|${Object.values(transactionData).join('|')}`;
   console.log(string);
    var  signature= crypto.createHash('sha256').update(string).digest('hex');
   
    console.log(signature);
    console.log(req.signature);
     console.log(bcrypt.compareSync(string,req.signature));
     if(signature==req.signature){
       //wkleić kod poniżej komentarza
     }else{
       
    console.log(signature==req.signature);
     res.status(200);
     res.set('Content-Type', 'text/plain');
     res.send("OK");
     }
*/


    res.status(200);
    res.set('Content-Type', 'text/plain');
    res.send("OK");
    Payment.findOneAndUpdate(
      { Transacionid: req.transactionId },
      { Status: "Opłacona" },
      (err, doc) => {
        if (!err) {
          console.log(doc);
          this.setpaystatus(doc);
        } else {
          console.log("Błąd podczas aktualizowania danych: " + err);
        }
      });


  },
  getdata: function (req) {
    return new Promise((resolve, reject) => {
      //var id=ObjectId(req);
      console.log("firstcondisiongetpayment");
      Payment.findOne({ Intention: req }, (err, respond) => {
        if (!err) {
          console.log("firstcondisiongetpayment" + respond);
          resolve(respond);


        } else {
          resolve(null);
        }
      })
    })
  },
  getpayment: function (req, res) {

    Payment.findOne({ Transacionid: req }, (err, doc) => {
      if (!err) {
        console.log(doc);
        //res.status(200);
        res.send(doc);
      } else {
        res.status(500);
        res.send("Bład przy wyszukiwaniu płatności" + err);
      }
    })
  },
  cancelintencion: function (req) {
    return new Promise((resolve, reject) => {

      console.log("firstcondisiongetpayment");
      Payment.findOneAndUpdate({ _id: req }, {
        Status: "Anulowana",
        Intention: null
      }, (err, respond) => {
        if (!err) {

          resolve(true);


        } else {
          resolve(false);
          console.log(err)
        }
      })
    })
  },
  updateAmount: function (intencion, amount) {
    return new Promise((resolve, reject) => {

      console.log("firstcondisionupdateamount");
      Payment.findOneAndUpdate({ Intention: intencion }, {
        Amount: amount
      }, (err, respond) => {
        if (!err) {

          resolve(true);


        } else {
          resolve(false);
          console.log(err)
        }
      })
    })
  },
  checkstatuspaymentid: function (req, res) {
    //console.log(req);
    Payment.findById({ _id: req }, { Status: 1 }, (err, doc) => {
      console.log(doc)
      console.log(doc.Status);
      if (!err) {
        if (doc.Status === "Oczekująca na płatność") {
          res.status(201);
          res.send("Oczekuje");
        }
        else if (doc.Status === "Opłacona") {
          res.status(200);
          res.send("opłacona");
        }
      } else {
        res.status(500);
        res.send("Błąd przy sprawdzeniu płatności" + err);
      }



    })
  },
  checkpaymentid: function (req, res) {

    Payment.findOne({ Intention: req }, (err, doc) => {
      //console.log(doc);
      if (!err) {
        switch (doc.Status) {
          case "Opłacona"://ustawic payment of na true
            res.status(205);
            res.send("Intencja jest oplacona");
            break;
          case "Anulowana"://ustawic payment of na true
            res.status(204);
            res.send("Nie możesz opłacić anulowanej intencji");
            break;
          default: {
            res.status(200);
            res.send(doc);
          }
        }




      }
      else {
        res.status(501);
        res.send("Błąd pobierania danych /payment/checkpaymentid" + err);
        console.log("Błąd pobierania danych /payment/detail" + err);
      }
    });
  }

};
module.exports = { Payment, PaymentSchema, PaymentController }