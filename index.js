require("dotenv").config();
const express = require("express");
const app = express();
const Person = require("./models/person");
app.use(express.json());
const cors = require("cors");
app.use(cors())
//serve static files from the build directory
app.use(express.static("build"));
// add morgan
const morgan = require("morgan");
// create a morgan token
morgan.token("bodyData",(req,res)=>{
  return ["data attached to post request",JSON.stringify(req.body)]
})
let logger = morgan(':method :url :status :res[content-length] - :response-time ms :bodyData');
app.use(logger)
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

// define the route to get all persons information
app.get("/api/persons",(req,res)=>{
    console.log("[REQ_PARAMS]",req.params);
    Person.find({}).then(data=>{
      res.json(data)
    })
})
// return the information of people currently in the phonebook
app.get("/api/info",(req,res)=>{
    let totalPersons = persons.length;
    let responseText = `As at ${new Date()}, The phonebook has info for ${totalPersons} people`;
    res.send(`<p>${responseText}</p>`);
})
// return the entry for a single person using the id;
app.get("/api/persons/:id",(req,res)=>{
    let id = req.params.id;
    let contact = persons.find(x=> String(x.id) === id);
    console.log("contact",contact)
    res.send(`<p>${contact.name} : ${contact.number}</p>`)
})
// delete a single entry with the id;
app.delete("/api/persons/:id",(req,res)=>{
    let id = req.params.id;
    Person.deleteOne({_id : id}).then((done=>{
      res.send("deleted").status(204)      
    })).catch(err=>console.log(err.message))

})
//add a single entry with a post request
app.post("/api/persons",(req,res)=>{
    let id = Math.round(Math.random() * 100000000000);
    let data = req.body;
    if(!data.name || !data.number){
        res.send({"error" : "both name and number must be added"})
    }
    else {
      const person = new Person(data).save().then((data)=>{
        console.log("req.body",req.body)
        res.send("added").status(201);
      }).catch(err=>{
        console.log(err.message)
      }) 
    }

})

app.listen(PORT,HOST,()=>{
    console.log(`server running on : http://${HOST}:${PORT}`);
});