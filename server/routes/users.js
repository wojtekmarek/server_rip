const router = require("express").Router()
const { UserController } = require("../models/schema/User")

router.post("/registeruser", (req, res) => {
   // console.log(req.body);

    const { error } = UserController.validate(req.body)
            if (error) {
                console.log("400");
                console.log(error.details[0].message);
                return res.status(400).send({ message: error.details[0].message })
            } else {
   UserController.register(req.body,res)
}
  
   })

router.post("/users", async (req, res) => {
    try {

        const { error } = UserController.validate(req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message })
        } else {
            UserController.loginuser(req.body, res);
        }
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera" })
    }
})
module.exports = router