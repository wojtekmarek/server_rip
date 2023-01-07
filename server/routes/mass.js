const router = require("express").Router();
const { MassController } = require("../models/schema/Mass")

router.get("/list", (req, res) => {

    MassController.showlist(req, res);
})

router.get("/availablemass", (req, res) => {

    MassController.availablemass(req, res);
})
router.get("/editview/:id", async (req, res) => {
    console.log(req.params);
    MassController.showedit(req, res);

})
router.get("/addview", async (req, res) => {
    MassController.showadd(req, res);

})
router.get("/checkcandelete/:id", async (req, res) => {
    //console.log("checkcandelete");
    //console.log(req.params.id);

    MassController.checkcandelete(req.params.id, res);

})
router.get("/delete/:id", (req, res) => {
    //console.log(req.params);
   MassController.delete(req, res);
})
router.post("/addtodb", async (req, res) => {
    //console.log(req.body);
    MassController.addnewtodb(req.body, res);


})
router.post("/editmassdb", async (req, res) => {
    //console.log(req.body);
    MassController.editmassdb(req.body, res);


})
router.post("/checkavailableaddinstans", async (req, res) => {
    MassController.checkavailableaddinstans(req.body, res);
})

module.exports = router