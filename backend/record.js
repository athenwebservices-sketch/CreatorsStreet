const express = require("express");
const recordRoutes = express.Router();
const dbo = require("./conn");
const ObjectId = require("mongodb").ObjectId;
 

// recordRoutes.route("/movies").get(function (req, res) {
//   let db_connect = dbo.getDb();
//   db_connect
//     .collection("movies")
//     .find({})
//     .toArray(function (err, result) {
//       if (err) throw err;
//       res.json(result);
//     });
//  });

recordRoutes.route("/movie").get(async function (req, res) {
  try {
    let db_connect = dbo.getDb();
    const movie = await db_connect
      .collection("movies")
      .findOne({ title: "Back to the Future" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = recordRoutes;