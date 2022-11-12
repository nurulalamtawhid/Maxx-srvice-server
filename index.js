const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require ('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());


//db


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_KEY}@database1.wijxnwd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db("maxxService").collection("Services");
        //console.log(serviceCollection);



        //api for home services
        app.get('/Homeservices', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        
        });
        //api for services section
        app.get('/services', async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        
        });
        // api for selected course details
       
        app.get('/services/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

    }
    finally{

    }

}
run().catch(error => console.error(error));


app.get('/',(req,res)=>{
    res.send('server running on')
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})