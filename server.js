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

// Create Server
const port = 4000;
const server = http.createServer(express());
const wss = new WebSocket.Server({ server });

// Connection
wss.on("connection", (ws) => {
  ws.on("message", async (data) => {
    const message = JSON.parse(data);
    // Used by Client in Settings
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
      }
    } else if (message.methode === "saveSelection") {
      try {
        await saveFavorites(message.selectedLine);
      } catch (error) {}
    }
  });
});

const favoriteLines = getFavoritesFromDb();

// Send every 5 seconds the latest updates to the clients
const interval = setInterval(async () => {
  let departures = await getDepartures(favoriteLines);
  wss.clients.forEach(function each(ws) {
    ws.send(JSON.stringify(departures));
  });
}, 5000);

wss.on("close", function close() {
  console.log("Client disconnected");
  clearInterval(interval);
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
