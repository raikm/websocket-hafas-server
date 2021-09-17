const express = require("express");
const http = require("http");
const WebSocket = require("ws");
// Hafas
const {
  showNearbyStationsWithLines,
  saveFavorites,
  getFavoritesFromDb,
} = require("./setup");
const { getDepartures } = require("./hafas");
const createClient = require("hafas-client");
const bvgProfile = require("hafas-client/p/bvg");

// const client = createClient(bvgProfile, "hafas");

// Create Server
const port = 4000;
const server = http.createServer(express());
const wss = new WebSocket.Server({ server });

// Connection
wss.on("connection", (ws) => {
  ws.on("message", async (data) => {
    const message = JSON.parse(data);

    if (message.methode === "requestStations") {
      try {
        const homeCoordinates = message.homeCoordinates;
        const result = await showNearbyStationsWithLines(
          homeCoordinates.latitude,
          homeCoordinates.longitude,
          homeCoordinates.distance
        );
        ws.send(JSON.stringify(result));
      } catch (error) {
        console.error("Client didn't send proper home coordinates!");
        // console.log(homeCoordinates);
      }
    } else if (message.methode === "saveSelection") {
      try {
        await saveFavorites(message.selectedLine);
      } catch (error) {}
    }
  });
});

const favoriteLines = getFavoritesFromDb();

const interval = setInterval(async () => {
  console.log("send");
  let departures = await getDepartures(favoriteLines);
  wss.clients.forEach(function each(ws) {
    ws.send(JSON.stringify(departures));
  });
}, 4000);

wss.on("close", function close() {
  console.log("Client disconnected");
  clearInterval(interval);
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
