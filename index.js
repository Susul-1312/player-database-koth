const express = require('express');
const io = require(process.cwd() + '/lib/io.js');
const bodyParser = require('body-parser');
const app = express();
const port = 6942;
const auth = 0;
var databasePath = "players.json";

if (io.databaseExists(databasePath)) {
  database = io.readDatabase(databasePath);
} else {
  database = [];
  io.writeDatabase(database, databasePath)
}

app.use(bodyParser.json());
app.listen(port, function () {
  console.log("Listening on Port: " + port);
});

app.get("/", (request, response) => {
  response.sendFile(process.cwd() + "/frontend/index.html")
});

app.post("/player", (request, response) => {
  const player = request.body;
  console.log(player);
  if (player.auth == auth) {
    player.auth = "Authorized";
    addplayerData(player);
  } else {
    console.log("Unauthorized attempt to add player data");
    console.log("Pass: " + player.auth);
    response.json("Unauthorized");
  }
});
app.post("/readPlayer", (request, response) => {
  for (var i = 0; i < database.length; i++) {
    if (database[i].name == request.body.name) {
      response.json(database[i]);
    }
  }
});
function addplayerData(player) {
  var databasePlayer;
  var notfound = true;
  const name = player.name;
  for (var i = 0; i < database.length; i++) {
    if (database[i].name == name) {
      databasePlayer = database[i];
      break;
    }
  }
  if (databasePlayer == undefined) {
    databasePlayer = {};
  }
  // start of updating the databasePlayer
  databasePlayer.name = player.name;
  if (player.points) {
    databasePlayer.points = player.points;
  }
  if (player.sets) {
    databasePlayer.sets = player.sets;
  }
  if (player.wins) {
    databasePlayer.wins = player.wins;
  }
  if (player.losses) {
      databasePlayer.losses = player.losses;
  }
  if (player.total) {
    databasePlayer.total = player.total;
  }
  if (player.strikes) {
    databasePlayer.strikes = player.strikes;
  }
  // end of updating databasePlayer
  for (var i = 0; i < database.length; i++) {
    if (database[i].name == databasePlayer.name) {
      database[i] = databasePlayer;
      notfound = false;
      break;
    }
  }
  if (notfound) {
    database.push(databasePlayer);
  }
  console.log("Database updated: " + JSON.stringify(database))
  io.writeDatabase(database, databasePath)
}
