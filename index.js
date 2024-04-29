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
    const countriesDB = client.db("explore-americas").collection("countries");

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

    app.get("/tourist-spots/countries/:country", async (req, res) => {
      const country = req.params.country;
      const query = { countryName: country };
      const foundResult = await exploreAmericasDB.find(query).toArray();
      res.send(foundResult);
    });

    app.get("/userSpots/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const foundResult = await exploreAmericasDB.find(query).toArray();
      res.send(foundResult);
    });

    app.get("/countries", async (req, res) => {
      const foundResult = await countriesDB.find().toArray();
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

    // PUT
    app.put("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          imageUrl: req.body.imageUrl,
          spotName: req.body.spotName,
          countryName: req.body.countryName,
          spotLocation: req.body.spotLocation,
          spotDescription: req.body.spotDescription,
          averageCost: req.body.averageCost,
          seasonality: req.body.seasonality,
          travelTime: req.body.travelTime,
          totalVisitorsPerYear: req.body.totalVisitorsPerYear,
        },
      };
      const updatedResult = await exploreAmericasDB.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(updatedResult);
    });

    //DELETE
    app.delete("/tourist-spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deletedResult = await exploreAmericasDB.deleteOne(query);

      res.send(deletedResult);
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
