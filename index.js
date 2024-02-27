const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 9800;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// to recive data from form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

// const mongourl = "mongodb://localhost:27017";
const mongourl =
  "mongodb+srv://sapna123:admin123@cluster0.pvatv.mongodb.net/?retryWrites=true&w=majority";
var db;
//get


//List All cities
app.get("/", (req, res) => {
  db.collection("Locations")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//List all restaurants
app.get("/restaurants", (req, res) => {
  db.collection("RestaurantsData")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// query example
app.get("/restaurant", (req, res) => {
  var query = {};
  if (req.query.stateId) {
    query = { state_id: Number(req.query.stateId) };
    // console.log(query);
  } else if (req.query.mealType) {
    query = { "mealTypes.mealtype_id": Number(req.query.mealType) };
    console.log(query);
  }
  db.collection("RestaurantsData")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

//List all QuickSearches
app.get("/quicksearch", (req, res) => {
  db.collection("Mealtypes")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// restaurant Details
app.get("/details/:id", (req, res) => {
  var id = req.params.id;
  db.collection("RestaurantsData")
    .find({ restaurant_id: Number(id) })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// menu Details on basis for restaurant
app.get("/menu/:id", (req, res) => {
  var id = req.params.id;
  console.log(id);
  db.collection("RestaurantsData")
    .find({ restaurant_id: Number(id) })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

app.post("/menuItem", (req, res) => {
  console.log(req.body);
  db.collection("RestaurantsData")
    .find({ menu_id: { $in: req.body.ids } })
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

// connect with database
MongoClient.connect(
  mongourl,
  { useUnifiedTopology: true },
  (err, connection) => {
    if (err) console.log(err);
    // provide database name
    db = connection.db("dbhotel");
  }
);

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Server is running on port ${port}`);
});
