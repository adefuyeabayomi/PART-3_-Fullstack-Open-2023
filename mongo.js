let mongoose = require("mongoose");
let password = process.argv[2];
let {name,number} = {
    name : process.argv[3],
    number : process.argv[4]
}
let dbURL = `mongodb+srv://adefuyeabayomi:${password}@cluster0.ppt7z.mongodb.net/FullstackTutorials?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false)
mongoose.connect(dbURL)
let personSchema = {
    name : String,
    number : Number
}
const Person = mongoose.model('Person', personSchema); 

if(name && number){  
    const person = new Person({
        name,number
    }) 
    person.save().then(response=>{
        console.log(process.argv[3],process.argv[4], "saved to the database!")
        mongoose.connection.close();
    })    
}
else {
    Person.find({}).then(res=>{
        console.log(res)
    })
}


