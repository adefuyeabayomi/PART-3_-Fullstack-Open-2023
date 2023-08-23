const mongoose = require("mongoose");
let url = process.env.DB_URL;
console.log("db url", url);
mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
  
  let personSchema = new mongoose.Schema({
      name : String,
      number : Number
  });
  personSchema.set("toJSON",{
    transform : function (doc,retObj){
      retObj.id = doc._id.toString();
      delete retObj._id;
      delete retObj.__v;
    }
  })

  const Person = mongoose.model('Person', personSchema);
  module.exports = Person;