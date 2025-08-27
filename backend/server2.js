const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
// step25: we install body-parser using : npm i body-parser and then import the following package in our code below : because : body-parser helps to convert the incoming JSON request body into a JavaScript object (req.body) you can easily use : because : when we recieve POST requests then Express doesn't parse the body automatically , so this is needed here.
const bodyparser = require('body-parser')

dotenv.config() 

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'passop';
const app = express()
const port = 3000
// step26: then we write the following code below to tell the Express App to use JSON body parson middleware on every incoming request , to make that accesible using "req.body" in the code now.
app.use(bodyparser.json()) 

client.connect();

// step23: so this API made for GET request will be used to get all the passwords.
app.get('/', async (req, res) => {
    const db = client.db(dbName)
   const collection = db.collection('documents') 
   const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

// step24: then we make a POST API to Save the passwords : this function will run when someone sends data to the server , to save a new password.
app.post('/', async (req, res) => {
    // step27: the POST API also now connects to the database like it did in GET
    const db = client.db(dbName)
   const collection = db.collection('documents') 
   const findResult = await collection.find({}).toArray();

//    step28: It sends back the exact body request recieved back to the client using the code below : so that we can check and test if the POST request is working correctly : to check that the server is correctly recieving the datat client sent and body parser is parsing it correctly to JSON into req.body : SO THIS : res.send(req.body) just sends back whatever object you received — this works for quick testing.
  res.send(req.body)

//   step29: now we can open POSTMAN : enter a localhost:3000 in POST : and send a POST request to the server with "raw" data : { "a" : 3} in it to the server > then on sending , we see the response in the Postman's response tab : indicating that the server recieved and parsed the data correctly and then sent back response due to "res.send(....)" line written above.

// step30: we can even send the test "raw" object sample as below : like it was there in the actual password we will be sending to the server -
// {
//     "id" : "23a672728",
//     "site" : "http://google.com",
//     "username" : "nischay",
//     "password" : "12345"
// }

// AND WE CAN SEE THATNIT ALSO ON CLICKING SEND GETS VISIBILE IN THE POSTMAN'S RESPONSE TAB : WHICH INDICATES THAT : THE DATA IS BEING SENT TO THE SERVER CORRECTLY HERE.
})


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
