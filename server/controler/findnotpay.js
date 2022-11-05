

const {findnotpay} = require("../models/schema/GraveQuarters");

async function findnotpaysetpayfield(req,res){
    const docs =await findnotpay();
    //console.log(docs+" out");
    console.log(typeof docs);
    console.log(Object.keys(docs).length);
   if(Object.keys(docs).length === 0 ){
    res.status(303).send("Nie ma takich obiektów");
        
    }else{
        
        console.log(typeof docs);
        res.status(200).send(docs);
      
    }
    
}

module.exports={findnotpaysetpayfield}