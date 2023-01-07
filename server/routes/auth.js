const router = require("express").Router();
const {UserController} = require("../models/schema/User");


router.post("/auth", async (req, res) => {
    console.log(req.body);
        try {

            const { error } = UserController.validate(req.body)
            if (error) {
                console.log("400");
                console.log(error.details[0].message);
                return res.status(400).send({ message: error.details[0].message })
            } else {
                console.log("in");
                UserController.loginuser(req.body, res);
            }
        } catch (error) {
            res.status(500).send({ message: "Wewnętrzny błąd serwera" })
            console.log("500");
        }
       
})

    
   
module.exports = router