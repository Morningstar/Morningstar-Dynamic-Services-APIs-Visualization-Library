const express = require("express");
const app = express();

const https = require('https');
const fs = require('fs');
const credentials = {
   key: fs.readFileSync(__dirname + '/key.pem'),
   cert: fs.readFileSync(__dirname + '/cert.pem')
};

https.createServer(credentials, app).listen(3000);

// app.listen(8080, () => {
//   console.log("Application started and Listening on port 3000");
// });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/*', (req, res) => {
  res.sendFile(__dirname + req._parsedUrl.path);
});
