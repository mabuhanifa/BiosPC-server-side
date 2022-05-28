const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4n3og.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("manufacturer_website").collection("products");
    const reviewsCollection = client.db("manufacturer_website").collection("reviews");
    const usersCollection = client.db("manufacturer_website").collection("users");
    const soldCollection = client.db("manufacturer_website").collection("sold");


    app.post('/login', async (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        res.send({ accessToken });
    });

    //geting all products on api call
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });


     //geting user/items api using id dynamyclicly

    app.get('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productsCollection.findOne(query);
        res.send(result);
    });

    //adding and posting user/items api

    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      console.log("adding new Item", newProducts);
      const result = await productsCollection.insertOne(newProducts);
      res.send(result);
    });

    //  deleting user/items api

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      console.log("deleting Item", id);
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    //adding and posting sold items api

    app.post("/sold", async (req, res) => {
      const sold = req.body;
      console.log("adding new Item", sold);
      const result = await soldCollection.insertOne(sold);
      res.send(result);
    });
    

  } catch (e) {
    console.error(e);
  } finally {
    //client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running CRUD server!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
