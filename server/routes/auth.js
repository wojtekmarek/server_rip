const router = require("express").Router()
const { User } = require("../models/schema/User")
const bcrypt = require("bcrypt")
const Joi = require("joi")

router.post("/auth", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).send({ message: "Błędny email lub hasło!" })
       /*do dodania hash hasla const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)*/
        if(req.body.password!=user.password)
            return res.status(401).send({ message: " Błędny email lub hasło!" })
        const token = user.generateAuthToken();
        const id=user.id;
        res.status(200).send({ data: {token,id}, message: "Zalogowano!" })
       
    } catch (error) {
        res.status(500).send({ message: "Wewnętrzny błąd serwera!" })
    }
    })
    const validate = (data) => {
    const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    
    })
return schema.validate(data)
}
module.exports = router