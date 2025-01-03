const mongoose =require('mongoose');

 //MONGO_DB =  "mongodb://localhost:27017/fineo";

mongoose.connect("mongodb://localhost:27017/IEG",
{useNewUrlParser:true, useUnifiedTopology:true})
     .then(()=>console.log('Monogo is Up'))
     .catch(err=> console.log('Mongo is down. Raison :',err));