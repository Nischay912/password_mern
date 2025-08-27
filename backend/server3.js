const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
// step51: we go on cors in express : documentation and import the package like this below.
const cors = require('cors')

dotenv.config() 

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'passop';
const app = express()
const port = 3000

app.use(bodyparser.json())
// step52: then we use cors in our app using the code below. 
app.use(cors())

client.connect();

app.get('/', async (req, res) => {
    const db = client.db(dbName)
    // const collection = db.collection('documents') 

    // step31: we rename the collections to be formed as 'passwords' instead of 'documents'
    const collection = db.collection('passwords')
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

app.post('/', async (req, res) => {
    // step33: we saw the request was coming in the form of "req.body" , so we save it in passwords below.
    const password = req.body

    const db = client.db(dbName)
    // step32: here also we rename the collections to be formed as 'passwords' instead of 'documents'
    const collection = db.collection('passwords') 

    // const findResult = await collection.find({}).toArray();
    // step33: we now instead of finding all in the collection and storing to array here in POST ; instead lets insert the request recieved in passwords as a new document everytime in the 'passwords' collection below.

    const findResult = await collection.insertOne(password)

    // res.send(req.body)
    // step34: now instead of returning the request we recieved itself back as response ; as that we did earlier just for testing our APIs were working correctly or not ; but now we send an object below indicating successfully saved in database , as a response below.

    res.send({success : true , result : findResult}) 

    // step35: this is sent to client to tell that your data was saved successfully & also shows a object "findResult" which is returned as response from MongoDB after insertion , with properties like "acknowledged" and a unique "id" too , to describe the outcome of findOne we did above and that id can be sued to r efer to that object again in future : because we had set the "id" as the id of passsword we generated using uuid in the frontend and not the "_id"  ; but the mongodb has "_id" as unique id for every document , so that id with which its saved in mongoDB appears in the response here : which is given by MongoDB itself , if not specified by user using "_id" .

    // step36: and now when the client will hit a GET request , it will now be able to see all the passwords from the passwords collection in the form of array done in GET request using find({}) as find({}) means return all the documents inside that collection ; that too in form of array as "toArray" was used there.

    // step37: we can check this again on POSTMAN by now sending POST request back on the server and we will be able to see the success object there now : AND IN MONGODB-COMPASS : our "passop" database would have been created too : with the collection 'passwords' in it : and the data we sent in POSTMAN : got added in the database there ; beacuse :  Postman actually sends real HTTP requests to your server, just like a browser or any client app would.
})

// step37: now lets write the code to delete a password by id

// step38: so we now are sending a delete request to the server using DELETE API
app.delete('/',async(req , res)=>{
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    // step39: and now we instead of inserting , do deletion here.
    const findResult = await collection.deleteOne(password)
    res.send({success:true , result:findResult})

    // step40: SO NOW ON "POSTMAN" , WE CAN SEE THAT : WE WHEN SEND POST REQUEST , DATAS ARE BEING ADDED ON MONGODB COMPASS & ON DOING DELETE , DELETES THEM ONE BY ONE ; AND WHEN GET REQUEST MADE ON POSTMAN ; IT SHOWS ALL THE OBJECTS IN FORM OF AN ARRAY THERE.

    // STEP41: KEEP THIS BACKEND SERVER RUNNING , and we now open the passop-mongo folder in new window in the vs-code and run npm run dev i.e. the frontend run there now.
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
