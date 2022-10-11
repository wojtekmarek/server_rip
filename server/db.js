

const mongoose = require("mongoose")
require('dotenv').config();
module.exports = () => {
    const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
    try {
    mongoose.connect(process.env.Mongo_Db_Link, connectionParams)
    console.log("Połączono z bazą danych user")
    } catch (error) {
    console.log("tu blad"+error);
    console.log("Problem z połączeniem do bazy!")
    }
}
