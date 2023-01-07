const router = require("express").Router();
const { update, insert, getovnerriptoclient, getlistovnernew, getlist, showedit, getburialforclient, OvnerRip, OvnerRipController } = require('../models/schema/OvnerRip');
const { UserController } = require("../models/schema/User");

router.get("/addovner", async (req, res) => {

       OvnerRipController.showadd(req, res);

});
router.get("/checkcandelete", async (req, res) => {
       console.log(req.query);
       await OvnerRipController.checkbeforedeleteuser(req.query)
              .then(response => {
                     if (response) {
                            console.log("delete true");
                            res.status(200);
                            res.send("cantdelete");
                     } else {
                            console.log("delete false");
                            UserController.deleteuser(req.query.id, res);
                     }
              })


});
router.get("/delete", (req, res) => {
       console.log(req.query);
       OvnerRipController.deleteovnerrip(req.query, res);
})
router.get("/getdataovnerrip", async (req, res) => {
       console.log(req.query);
       getovnerriptoclient(req.query, res);


})
router.get("/getdataovnerripburial", async (req, res) => {
       console.log(req.query);
       getburialforclient(req.query.ovnerripid, res);


})

router.get("/list", (req, res) => {
       getlist(res);
})
router.get("/listovnernew", (req, res) => {

       getlistovnernew(res);

});

router.get("/saveovnerdata", async (req, res) => {

       if (UserController.saveuserdataovner(req.query)) {
              console.log("save1");
              OvnerRipController.saveuserdata(req.query, res);
       } else {
              res.status(500);
              res.send("Błąd aktualizacji hasła dla ovnerripa");

       }



});
router.get("/:id", (req, res) => {
       showedit(req, res);
})







router.get("/Number_enable_intensionsdit", (req, res) => {
       showadd(req, res);


})
router.post("/addtomongobase", (req, res) => {
       console.log(req.body)
       if (req.body._id == "") {
              insert(req, res)
       } else {
              update(req, res)
       }
})



module.exports = router