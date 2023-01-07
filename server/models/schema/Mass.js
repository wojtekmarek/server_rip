
const mongoose = require("mongoose");



const MassSchema = new mongoose.Schema({


  Date_Of_even: { type: Date, required: true },
  Number_enable_intensions: { type: Number, required: true, default: 0 },
  Number_intension: { type: Number, required: true, default: 0 },
  Enable_intensions: { type: Boolean, require: true, default: false }//pole do wyszukiwania bez widoku



});

const Mass = mongoose.model("Mass", MassSchema);




const MassController = {
  showedit: function (req, res) {
    Mass.findById(req.params.id, (err, doc) => {

      if (!err) {
        today = new Date();
        console.log(doc);
        doc.Date = doc.Date_Of_even.getDate() + "-" + (doc.Date_Of_even.getMonth() + 1) + "-" + doc.Date_Of_even.getFullYear()
        doc.Time = (doc.Date_Of_even.getHours()-2) + ":" + doc.Date_Of_even.getMinutes()
        console.log(doc.Date);
        console.log(doc.Time);
        console.log(today)
        res.render("addoreditmass", {
          action: "/mass/editmassdb",
          Mass: doc,
          today: today,
          viewTitle:"Edytuj Mszę",
         year:doc.Date_Of_even.getFullYear(),
         month:doc.Date_Of_even.getMonth(),
         day:doc.Date_Of_even.getDate()
   
          
        });
      }
      else {
        console.log("something wrong with showedit mass")
      }
    });
  },

  addnewtodb: function (req, res) {

    /*console.log(req.Date_Of_even);
    console.log(req.Date_Of_even.slice(6,10));
    console.log((Number(req.Date_Of_even.slice(3,5))-1).toString());
    console.log(req.Date_Of_even.slice(0,2));*/
    date = new Date(req.Date_Of_even.slice(6, 10), (Number(req.Date_Of_even.slice(3, 5)) - 1).toString(),
      req.Date_Of_even.slice(0, 2), (Number(req.Time_Of_even.slice(0, 2)) + 1).toString(), req.Time_Of_even.slice(3, 5));
    console.log(date);
    var mass = new Mass()
    mass.Date_Of_even = date;
    mass.Number_enable_intensions = Number(req.Number_enable_intensions);
    if (mass.Number_enable_intensions > 0) { mass.Enable_intensions = true; }

    mass.save((err, doc) => {
      if (!err) {
        res.redirect("/mass/list")
      } else {
        console.log("Błąd podczas dodawania Mszy: " + err)
      }
    })
  },
  showadd: function (req, res) {
    res.render("addoreditmass", {
      action: "/mass/addtodb",
      viewTitle:"Dodaj Mszę",
      year:"2100",
      month:"10",
      day:"10"

    });
  },
  showlist: function (req, res) {
    Mass.find((err, docs) => {
      if (!err) {
        docs.forEach(element => {
          element.Date = element.Date_Of_even.toISOString().slice(0, 10).split("-").reverse().join("-");
          element.Time = element.Date_Of_even.toISOString().slice(11, 16);
        });

        console.log(docs);

        res.render("listmass", {
          list: docs,


        });


      } else {
        console.log("Błąd pobierania danych /mass/list" + err)
      }
    })
  },
  checkcandelete: function (req, res) {
    console.log(req);
    const { Intention } = require("./Intention");
    Intention.find({ Mass: req }, (err, doc) => {
      if (!err) {
        //console.log(doc[0]);
        if (doc[0] !== undefined) {
          console.log(doc)
          res.send({ "intencion": true });
        } else {
          res.send({ "intencion": false });
        }
      }

      else {
        console.log("Błąd pobierania danych przy usuwaniu mass" + err)
      }
    });
  },
  changeintensnumerinmass: function (req, date) {
    //console.log(typeof Number_intension);
    return new Promise((resolve, reject) => {
      var mass = {
        Number_intension: Number(date.Number_intension) + 1,
        Date_Of_even: date.Date_Of_even,
        Number_enable_intensions: Number(date.Number_enable_intensions),
      }
      if (mass.Number_enable_intensions == mass.Number_intension) { mass.Enable_intensions = true; }
      else { mass.Enable_intensions = false; }

      //console.log(mass);
      //console.log(typeof mass);

      Mass.findOneAndUpdate(
        { _id: req.Mass },
        mass,
        (err, doc) => {

          if (!err) {
            resolve([true]);
          } else {
            console.log("Błąd podczas edycji Mszy: " + err)
            resolve([false, err]);
          }
        })
    });
  },
  addintenciontomass: function (req, data, res) {

    const { IntentionController } = require("./Intention");
    var intencion_id;
    IntentionController.add(req)
      .then(respond => {


        if (respond[0]) {
          intencion_id = respond[1];
          this.changeintensnumerinmass(req, data)
            .then(respond => {

              const { PaymentController } = require("./Payment");
              PaymentController.createnew(req = {
                Title: "Intencja",
                Status: "Utworzona",
                Amount: req.Amount,
                Intention: intencion_id
              })
                .then(respond => {
                  console.log("then3");
                  console.log(respond[0]);
                  if (respond[0]) {
                    res.json({ Intention: intencion_id, Payment_id: respond[1] });
                  } else {
                    return false;
                  }
                });
            })

        } else {
          res.json({ err: respond[1] })
        }

      })
      .catch((err) => {
        res.json({ err });
        console.log(err);
      })


  },
  checkavailableaddinstans: function (req, res) {
    console.log(req);

    Mass.findById(req.Mass, (err, doc) => {
      if (!err) {
        if (doc.Number_enable_intensions > doc.Number_intension) { //console.log(doc);
          this.addintenciontomass(req, doc, res);
        } else {
          //console.log({"intencion_ available":false});

          res.send({ "intencion_ available": false });
        }
      } else {
        console.log("Błąd pobierania danych przy sprawdzeniu dostepnosci intenci mass" + err)
      }
    }
    )
  },
  availablemass: function (req, res) {

   var now = new Date();
    Mass.find(
    
      {$expr:{$gt:["$Number_enable_intensions", "$Number_intension"]}, 
       Date_Of_even: {

        $gt: now
      }},

     { _id: 1, Date_Of_even: 1 }
      , (err, docs) => {
        if (!err) {
          console.log(docs);

          res.send(docs);



        } else {
          console.log("Błąd pobierania dostępnych mszy intencjit" + err)
          res.status(404);
        }
      })
  },
  delete: function (req, res) {
    Mass.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        //res.json({status:true});
        res.redirect("/mass/list")
      } else {
        console.log("Błąd podczas usuwania mszy: " + err);
      }
    })
  },
  subtractionintens: function (req, res) {
    return new Promise((resolve, reject) => {
      Mass.findOneAndUpdate(
        { _id: req },
        { "$inc": { "Number_intension": -1 } },
        (err, doc) => {

          if (!err) {
            resolve([true]);
          } else {
            console.log("Błąd podczas edycji Mszy: " + err)
            resolve([false, err]);
          }
        })
    })
  },
  getdata: function (req) {
    return new Promise((resolve, reject) => {
      //var id=ObjectId(req);
      Mass.findById(req, (err, doc) => {
        if (!err) {
          resolve(doc);
        } else {
          resolve(null);
        }
      })
    })
  },
  cancelintecion: function (req) {
    return new Promise((resolve, reject) => {
      //var id=ObjectId(req);
      console.log("massintens");
      Mass.findOneAndUpdate({ _id: req.Mass },
        { "$inc": { "Number_intension": +1 } },
        (err, respond) => {
          if (!err) {

            resolve(true);


          } else {
            resolve(false);
            console.log("Błąd podczas zmiany ilosci intencji mszy: " + err)
          }
        })
    })
  },
  editmassdb: function (req, res) {
    console.log(req);
    
   
    req.Number_enable_intensions = Number(req.Number_enable_intensions);
    if(req.Date_Of_even!== undefined)

    { let datastrinsplit=req.Date_Of_even.split("-");
      let timesrtingsplit=req.Time_Of_even.split(":");
      date = new Date(datastrinsplit[2],datastrinsplit[1],
        datastrinsplit[0],(Number(timesrtingsplit[0])+2),timesrtingsplit[1]);
      console.log(date);
    req.Date_Of_even = date;
      var updatedata={
        Date_Of_even: req.Date_Of_even,
        Number_enable_intensions: req.Number_enable_intensions
      }
    }else{
      var updatedata={
        Number_enable_intensions: req.Number_enable_intensions
   
      }
    }
    
    console.log(updatedata);
    Mass.findByIdAndUpdate(req.Id, updatedata, (err, doc) => {
      if (!err) {
        res.redirect("/mass/list")
      } else {
        console.log("Błąd podczas edycji Mszy: " + err);
        res.send("Błąd podczas edycji Mszy: " + err+ "Spróbuj jeszcze raz . W przypadku ponownego wysąpienia błedu skontaktuj się z administratorem systemu");
      }
    })
  }

}



module.exports = { Mass, MassSchema, MassController };