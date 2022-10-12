

const mongoose = require("mongoose")
require('dotenv').config();
module.exports = async () => {
    const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
    const mongoconection= await process.env.Mongo_Db_Link;
    try {
    mongoose.connect(mongoconection, connectionParams)
    console.log(mongoconection);
    console.log("Połączono z bazą danych user");
    } catch (error) {
    console.log("tu blad"+error);
    console.log("Problem z połączeniem do bazy!");
    }
}
