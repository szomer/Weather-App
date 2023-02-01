const express = require("express");

const apiController = require("./controllers/apiController.js");

const port = process.env.port || 3000;

var app = express();
app.use("/assets", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index.ejs");
});

apiController(app);

app.listen(port);
