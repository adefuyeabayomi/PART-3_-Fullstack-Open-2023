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
//define and implement the error handling middle ware
const errorHandlerMiddleware = function(error,request,response,next){
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}
app.use(errorHandlerMiddleware);
// define the route to get all persons information
app.get("/api/persons",(req,res,next)=>{
    console.log("[REQ_PARAMS]",req.params);
    Person.find({}).then(data=>{
      res.json(data)
    }).catch(err=> next(err))
})
// return the information of people currently in the phonebook
app.get("/api/info",(req,res,next)=>{
    let totalPersons = 0;
    let responseText = `As at ${new Date()}, The phonebook has info for ${totalPersons} people`;
    res.send(`<p>${responseText}</p>`);
})
// return the entry for a single person using the id;
app.get("/api/persons/:id",(req,res,next)=>{
    let id = req.params.id;
    Person.find({_id : id}).then(contact=>{
      res.send(`<p>${contact.name} : ${contact.number}</p>`)      
    }).catch(err=>{
      next(err);
    })
})
// update the entry for a single user
app.put("/api/persons/:id",(req,res,next)=>{
  let id = req.params.id;
  let body = req.body;
  Person.updateOne({_id:id},{number: body.number}).then(contact=>{
    console.log("updated return", contact);
    res.send(`<p>Updated ${body.name} : ${body.number}</p>`)      
  }).catch(err=>{
    next(err);
  })
})
// delete a single entry with the id;
app.delete("/api/persons/:id",(req,res,next)=>{
    let id = req.params.id;
    Person.deleteOne({_id : id}).then((done=>{
      res.send("deleted").status(204)      
    })).catch(err=>next(err))
})
//add a single entry with a post request
app.post("/api/persons",(req,res,next)=>{
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
        next(err)
      }) 
    }
})

app.listen(PORT,HOST,()=>{
    console.log(`server running on : http://${HOST}:${PORT}`);
});