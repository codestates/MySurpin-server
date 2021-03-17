const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send("MySurpin server connected")
});


const ca = fs.readFileSync(process.env.SSL_CA);
const key = fs.readFileSync(process.env.SSL_PRIVATE);
const cert = fs.readFileSync(process.env.SSL_CERT)

if(ca && key && cert){
  https.createServer({
    ca,
    key,
    cert
  }, app).listen(443, () => {
    console.log("server working now");
  });
}
else{
  console.log("key's location is not exists");
}