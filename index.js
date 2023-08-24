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
  res;
  return ["data attached to post request",JSON.stringify(req.body)]
})
let logger = morgan(':method :url :status :res[content-length] - :response-time ms :bodyData');
app.use(logger)
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";
//define and implement the error handling middle ware
const errorHandlerMiddleware = function(error,request,response,next){
  console.error("Error:",error.message)
  if (error.name === 'CastError') {
    console.log("error is cast error")
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if(error.name === 'ValidationError'){
    console.log("error is validation error")
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// define the route to get all persons information
app.get("/api/persons",(req,res,next)=>{
    console.log("[REQ_PARAMS]",req.params);
    Person.find({}).then(data=>{
      res.json(data)
    }).catch(err=> next(err))
})
// return the information of people currently in the phonebook
app.get("/api/info",(req,res,next)=>{
    Person.countDocuments({}).then(count=>{
      let responseText = `As at ${new Date()}, The phonebook has info for ${count} people`;
      res.send(`<p>${responseText}</p>`);      
    }).catch(err=> next(err))
})
// return the entry for a single person using the id;
app.get("/api/persons/:id",(req,res,next)=>{
    let id = req.params.id;
    Person.find({_id : id}).then(contact=>{
      console.log("GET ID",contact)
      res.send(`<p>${contact[0].name} : ${contact[0].number}</p>`)      
    }).catch(err=>{
      next(err);
    })
})
// update the entry for a single user
app.put("/api/persons/:id",(req,res,next)=>{
  let id = req.params.id;
  let body = req.body;
  Person.updateOne({_id:id},{number: body.number},{ new: true, runValidators: true, context: 'query' }).then(contact=>{
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
      console.log(done)
      res.send("deleted").status(204)      
    })).catch(err=>next(err))
})
//add a single entry with a post request
app.post("/api/persons",(req,res,next)=>{
    let data = req.body;
    if(!data.name || !data.number){
        res.send({"error" : "both name and number must be added"})
    }
    else {
      new Person(data).save().then(()=>{
        console.log("req.body",req.body)
        res.send("added").status(201);
      }).catch(err=>{
        next(err)
      }) 
    }
})

app.use(errorHandlerMiddleware);

app.listen(PORT,HOST,()=>{
    console.log(`server running on : http://${HOST}:${PORT}`);
});