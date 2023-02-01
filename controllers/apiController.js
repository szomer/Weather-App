const bodyParser = require("body-parser");
const weather = require("weather-js");
const ImageModel = require("../models/imageModel.js");
const express = require("express");
var path = require("path");

module.exports = function (app) {
  // bodyparser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/api/weather/:location", function (req, res) {
    weather.find(
      { search: req.params.location, degreeType: "C" },
      function (err, result) {
        if (err) {
          res.render("error.ejs", {
            Status: "505",
            Location: req.params.location,
            Error: "Server Error, Please Try Again",
          });
        } else if (Object.keys(result).length === 0) {
          res.render("error.ejs", {
            Status: "404",
            Location: req.params.location,
            Error: "Location does not exist",
          });
        } else {
          const weatherData = JSON.stringify(result[0]);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(weatherData);

          // const str = result[0].location.name;
          // const str1 = str.substring(0, str.indexOf(","));
          // const str2 = str1.replace(/\s+/g, "-").toLowerCase();
          // ImageModel(str2);
        }
      }
    );
  });

  app.get("/api/picture/:location", async function (req, res) {
    const location = req.params.location;
    const filepath = await ImageModel(location);

    if (filepath) {
      res.sendFile(path.resolve(__dirname + "/../bg.jpg"));
      console.log(`[Sent Image] ${filepath}`);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`[Could Not Download Image] '${location}'`);
    }
  });
};
