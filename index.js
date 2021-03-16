const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send("MySurpin server connected")
});

app.listen(80, () => {
  console.log("80 port opened!");
})