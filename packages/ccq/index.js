const express = require('express')
const cors = require('cors')
const CCQ = require('./handlers/leaderboard.js')

const app = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'API-KEY')
  next()
})

app.get("/", cors(), async (req, res) => {
  res.send("wormhole service");
});

app.use((req, res, next) => {
  const apiKey = req.get('API-KEY')
  if (!apiKey || apiKey != process.env.API_KEY) {
    console.log(process.env.API_KEY)
    res.status(401).json({error: 'unauthorised. Incorrect API key'})
  } else {
    next()
  }
})

app.get("/leaderboard/:chain", cors(), async (req, res) => {
  try{
    const response = await CCQ(req.params.chain);
    res.status(200);
    res.json(response)
  }catch(error){
    console.log("Error leaderboard: ", error)
    res.status(500).json({error: `failed to perform CCQ`})
  }
});

module.exports = app;
