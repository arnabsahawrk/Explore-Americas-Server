const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//config
require("dotenv").config();
const port = process.env.PORT || 8080;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//Database Authenticate
// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2p5zaxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    const exploreAmericasDB = client
      .db("explore-americas")
      .collection("tourist-spots");

    //GET
    app.get("/tourist-spots", async (req, res) => {
      const foundResult = await exploreAmericasDB.find().toArray();
      res.send(foundResult);
    });

    app.get("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const foundResult = await exploreAmericasDB.findOne(query);
      res.send(foundResult);
    });

    //SORT
    app.get("/tourist-spot-ascending", async (req, res) => {
      const foundResult = await exploreAmericasDB
        .find()
        .sort({ averageCost: 1 })
        .toArray();
      res.send(foundResult);
    });

    app.get("/tourist-spot-descending", async (req, res) => {
      const foundResult = await exploreAmericasDB
        .find()
        .sort({ averageCost: -1 })
        .toArray();
      res.send(foundResult);
    });

    //POST
    app.post("/tourist-spots", async (req, res) => {
      const insertedResult = await exploreAmericasDB.insertOne(req.body);
      res.send(insertedResult);
    });
  } catch (err) {
    console.error("Fell Database.", err);
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Server is running on ${port}`);
});

app.listen(port, () => {
  console.log(`Server connected on ${port}`);
});
