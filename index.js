const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config()

const app = express()

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqk1vsl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const noteCollection = client.db('toDoList').collection('notes')

        app.post('/notes', async (req, res) => {
            const notes = req.body;
            const result = await noteCollection.insertOne(notes)
            res.send(result)
        })

        //Get All Tasks added by a specific user
        app.get('/myTasks', async (req, res) => {
            const email = req.query.email;
            //Set the Query
            const query = {
                email: email
            }
            //Find the data from the collection
            const result = await noteCollection.find(query).toArray()
            res.send(result)
        })

        //Get all Completed Task for a Specific User
        app.get('/completeTasks', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email,
                status: 'Completed'
            }
            //Find the data from the collection
            const completedTasks = await noteCollection.find(query).toArray()
            res.send(completedTasks)
        })

        //Delete a specific task
        app.delete('/deletetask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await noteCollection.deleteOne(query)
            res.send(result)
        })
    }

    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('ToDo list server is running')
})

app.listen(port, () => console.log(`ToDo list running on ${port}`));