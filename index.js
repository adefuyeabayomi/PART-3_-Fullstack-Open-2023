const express = require("express");
const app = express();
app.use(express.json())
const PORT = 3001;
const HOST = "localhost";
// define the numbers array
let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "John Doe",
      "number": "123-456789"
    },
    {
      "id": 3,
      "name": "Jane Smith",
      "number": "987-654321"
    },
    {
      "id": 4,
      "name": "Alice Johnson",
      "number": "555-123456"
    },
    {
      "id": 5,
      "name": "Bob Anderson",
      "number": "555-987654"
    },
    {
      "id": 6,
      "name": "Eva Martinez",
      "number": "888-555555"
    },
    {
      "id": 7,
      "name": "Michael Brown",
      "number": "777-888999"
    },
    {
      "id": 8,
      "name": "Sophia Lee",
      "number": "666-111222"
    },
    {
      "id": 9,
      "name": "Daniel Wilson",
      "number": "999-444555"
    },
    {
      "id": 10,
      "name": "Olivia Davis",
      "number": "111-333444"
    },
    {
      "id": 11,
      "name": "Liam Taylor",
      "number": "222-666777"
    },
    {
      "id": 12,
      "name": "Ava Hernandez",
      "number": "333-999000"
    },
    {
      "id": 13,
      "name": "Noah Miller",
      "number": "444-222333"
    },
    {
      "id": 14,
      "name": "Mia Moore",
      "number": "666-555888"
    },
    {
      "id": 15,
      "name": "William Jackson",
      "number": "888-444777"
    }
  ];

// define the route to get all persons information
app.get("/api/persons",(req,res)=>{
    console.log("[REQ_PARAMS]",req.params);
    res.send(persons);
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
    let newPersonsArray = persons.filter(x=> String(x.id) !== id);
    persons = newPersonsArray;
    res.send("deleted").status(204)
})
//add a single entry with a post request
app.post("/api/persons",(req,res)=>{
    let id = Math.round(Math.random() * 100000000000);
    let data = req.body;
    if(!data.name || !data.number){
        res.send({"error" : "both name and number must be added"})
    }
    else if(persons.find(x=>x.name === data.name)){
        res.send({"error" : "user already exist, name must be unique"})
    }
    else {
        data.id = id;
        persons.unshift(data);
        console.log("req.body",req.body)
        res.send("added").status(201);
    }

})

app.listen(PORT,HOST,()=>{
    console.log(`server running on : http://${HOST}:${PORT}`);
});