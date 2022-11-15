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

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db("maxxService").collection("Services");
        const reviewCollection =  client.db("maxxService").collection("Reviews");
        
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
        //api for addd service 
        app.post('/addservices',async(req,res)=>{
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.send(result);
        })
        // api for review insertion
        app.post('/reviews',async(req,res)=>{
            const reviews = req.body;
            const result  = await reviewCollection.insertOne(reviews);
            res.send(result);
        });
        // api for get get review
        app.get('/serviceReview/:serviceId',async(req,res)=>{
            //console.log(req.params.serviceId);
            const result = await reviewCollection.find({service:req.params.serviceId}).toArray();
            res.send(result)
        })
        //api for getting my review section throug mail address
        app.get('/review',async(req,res)=>{
            let query = {};
            console.log(req.query.email);
            if(req.query.email){
                query = {
                    email : req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)

        })
        // api for get review by id for update  a review item
        app.get('/review/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.findOne(query);
            res.send(result);
        })
        //api for update a review
       app.put('/review/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id:ObjectId(id)};
            const option ={upsert :true}
            const Review = req.body;
            console.log(Review);
            const updatedreview = {
                $set : {
                    Review: Review.Review
                    
                }
            }
            const result = await reviewCollection.updateOne(query,updatedreview,option);
            res.send(result)
            
        })
        //api for delete a item for my review
        app.delete('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


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