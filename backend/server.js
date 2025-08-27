// step3: as usual we copy the hello world code from express website documentation to start with here below.
const express = require('express')

// step11: add the following code from documentation of "npm mongodb" : "MongoClient" is what we use to connect to a MongoDB database and run queries.
const { MongoClient } = require('mongodb');

// step12: add the following two lines of code now from the documentation of "npm mongodb"
const url = 'mongodb://localhost:27017'; //set the url where our mongoDB server is running , so that the client knows where to connect to.

const client = new MongoClient(url); //we create a MongoClient object now using the url , which will be used to connect and interact with the database.

// step13: we also copy this line from the documentation of "npm mongodb" from there and set our database name to "passop" : this will be created by MongoDB if it not exists.
const dbName = 'passop';

// step5: we now install a package called "env" for environment variables : npm i dotenv

// step6: then we add the below two lines taken from its documentation below and then create a file .env and go there now.
// require('dotenv').config()

// step14: we can rewrite the above code as follows , to make it look clearer -

const dotenv = require('dotenv') //loads the dotenv package
dotenv.config() //.config used to read ".env" file and place the values in process.env to be used later whenevr needed.

// console.log(process.env) : done just to confirm its working : will comment out later

// step9: we can do the following to see the URI we had set in .env there -
console.log(process.env.MONGO_URI)

const app = express()
const port = 3000

// step17: next we copy the below line from the documentation below. This line will be used to start the connection to MongoDB using the url given earlier , in order to write queries in the database later now.
client.connect();

// step18: then we copy this code from the documentation below.
// const db = client.db(dbName)

// step16: make the function async as "Await" is being used inside this below.

// step22: we have made a GET endpoint for "/" below which will run the function inside it when we visit the localhost:3000/
app.get('/', async (req, res) => {

    // step21: we now placed the step18's code here in this async function as it was showing error that , we had await client.connect() earlier which was not in an async function , so we removed await from there and placed the code below here inside this async function here below.
    const db = client.db(dbName) //this was written to tell MongoDB which database to work with.

//   res.send('Hello World!')
//   step19: then we copy th below code from that documentation -
  const collection = db.collection('documents') //we get the 'documents' collection like a table that we have in SQL and if it not exists MongoDB will create one , when we insert a data.

//   step15: now we copy the below code from the documentation from the section there on documentation named as : "find all the documents" section vala code , and pasted it below here.
  const findResult = await collection.find({}).toArray(); //find({}) matches all documents due to {} used and converts it into an array : so we now get all the stored data from the collection here.


//   step20: then we do write the below code here -
  res.json(findResult) //we send the "findResult" array as JSON to whoever requested at endpoint "/"
})

// SO NOW WHEN WE VISIT localhost:3000/ : BROSWER SENDS GET REQUEAT TO THE SERVER AND THEN OUR EXPRESS APP RUNS THE GET FUNCTION ABOVE AND SENDS BACK A JSON ARRAY : AND BROWSER DISPLAYS A PLAIN JSON TEXT THERE.

// IT WILL BE EMPTY ARRAY NOW SHOWN THERE AS WE HAVEN'T ADDED ANYTHING YET IN OUR DATABASE ; SO LETS DO IT IN SERVER2.JS NOW.

app.listen(port, () => {
    // step4: we made http://localhost: below to be printed too in console for better readability in terminal's console and then ctrl+right click to go there and see "hello world" there now.
  console.log(`Example app listening on port http://localhost:${port}`)
})
