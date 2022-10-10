

const mongoose = require("mongoose")

module.exports = () => {
    const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
    try {
    mongoose.connect("mongodb://localhost:27017/auth_react", connectionParams)
    console.log("Połączono z bazą danych user")
    } catch (error) {
    console.log("tu blad"+error);
    console.log("Problem z połączeniem do bazy!")
    }
}
