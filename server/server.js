
require('dotenv').config()
const connection = require('./db')
console.log(process.env.DB)
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const handleBars = require("handlebars");
const exphbs = require("express-handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const ovnerriproute=require("./routes/ovnerrip");
const anonseroute=require("./routes/anonse");
const userdbroute=require("./routes/userdb");
const userroute=require("./routes/users");
const gravequarters=require("./routes/gravequarters");
const burialroute=require("./routes/burial");
const exhumation=require("./routes/exhumation");
const sendMail=require("./routes/mailsend");
/*


*/ 

connection();



const app = express()

app.use(bodyParser.json())
app.disable('x-powered-by')
app.use(cors());
app.use(express.urlencoded({
    extended: true
   }))
   app.set("views", path.join(__dirname, "/view/"))
   app.engine(
    "hbs",
    exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(handleBars),
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname+'/view',
    partialsDir: __dirname + '/view/partials/'
    })
   )
   app.set("view engine", "hbs")




//tablice route

app.use('/', require("./routes/auth")
  
);
app.use('/gravequarters',gravequarters);
app.use('/ovnerrip',ovnerriproute);
app.use('/anonse',anonseroute);
app.use('/userdb',userdbroute);
app.use('/user',userroute);
app.use('/burial',burialroute);
app.use('/exhumation',exhumation);
app.use('/mail',sendMail);
/*
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
  require('./routes/project_routes'),
  require('./routes/data_routes')
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
*/

app.get('/about', function(req, res){
 
   res.send("Serwer work fine and listen");
    
   });



module.exports = app