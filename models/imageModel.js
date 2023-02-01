const fs = require("fs");
const client = require("https");
const express = require("express");

let url;

const getUrl = async (location) => {
  url = "";

  await fetch(
    `https://api.teleport.org/api/urban_areas/slug:${location}/images/`
  )
    .then((response) => response.json())
    .then(async (data) => {
      url = data.photos[0].image.web;
      console.log(`[Image URL] ${url}`);
    })
    .catch(() => {
      console.log(`[Image URL] ${url}`);
      return;
    });
};

const downloadImg = async (location) => {
  await getUrl(location);
  const filepath = "./bg.jpg";

  if (!url) {
    return;
  }

  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => {
            console.log(`[Downloaded Image] ${location}`);
            resolve(filepath);
          });
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
};

module.exports = downloadImg;
