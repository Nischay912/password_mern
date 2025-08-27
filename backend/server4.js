const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config() 

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

const dbName = 'passop';
const app = express()
const port = process.env.PORT || 3000

app.use(bodyparser.json()) 
app.use(cors())

client.connect();

app.get('/', async (req, res) => {
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords') 
    const findResult = await collection.insertOne(password)
    res.send({success : true , result : findResult}) 
})

// step61: so we updated the DELETE API to delete the data based on the id of the form sent from FRONTEND here now.
app.delete('/', async (req, res) => {
  try {
    // step62: Extract the 'id' property from the incoming request body object. This 'id' identifies which password document to be deleted.
    const { id } = req.body;

    // step63: If 'id' is not provided in the request, respond with status 400 (Bad Request) and a JSON message indicating the client error.
    if (!id) {
      return res.status(400).send({ 
        success: false, 
        message: "id is required" 
        /* step64: client can see this error if he does it ; in the frontend if we there do : 
                    const res = await fetch(...);
                    if (!res.ok) { 

                    //res.ok is a boolean property that is true if the HTTP status code is in the range 200–299, meaning the request was successful ; else its false.

                        const errorData = await res.json();
                        console.log(errorData.message);  // "id is required"
                        // You can show this message in UI as error notification there.
                    }
        */
      });
    }

    // step65: We then Connect to the MongoDB database named 'passop'
    const db = client.db(dbName);

    // step66: We Select the 'passwords' collection inside the database
    const collection = db.collection('passwords');

    // step67: We now Perform the deletion by Finding one document where the 'id' field matches the provided 'id'and delete exactly that document.
    const result = await collection.deleteOne({ id: id });

    // step68: Check the result of the deletion operation:If 'deletedCount' is 1, it means a document was found and deleted successfully.

    // "deletedCount" is a built-in property of the result object returned by MongoDB’s deleteOne() (and deleteMany()) method
    if (result.deletedCount === 1) {
      // step69: so we send a JSON response indicating success
      res.send({ 
        success: true, 
        message: "Password deleted successfully" 
      });
    } else {
      // step70: If no document matched the given 'id' (deletedCount is 0) Send a JSON response indicating failure to find the document.
      res.send({ 
        success: false, 
        message: "No document found with that id" 
      });
    }
  } 
  catch (error) {
    // step71: now in this catch block : If any error occurs during this process (database errors, etc.)and responds with status 500 (Internal Server Error) we can even Include the error message for debugging below in the response sent , via : error.message
    res.status(500).send({ 
      success: false, 
      message: "Error deleting password", 
      error: error.message 
    });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
