import express from "express";
import http from "http";
import * as WebSocket from "ws";
import { getDepartures } from "./hafas";
// Hafas Helper Methods
import {
  // showNearbyStationsWithLines,
  // saveFavorites,
  getFavoritesFromDb,
} from "./stationSetup";

// Create Server
const PORT = process.env.PORT || 4000;
const server = http.createServer(express());
const wss = new WebSocket.Server({ server });

// Connection
wss.on("connection", async (ws) => {
  ws.on("message", async (data) => {
    // const message = JSON.parse(data);
    // Used by Client in Settings
    // if (message.methode === "requestStations") {
    //   try {
    //     const homeCoordinates = message.homeCoordinates;
    //     const result = await showNearbyStationsWithLines(
    //       homeCoordinates.latitude,
    //       homeCoordinates.longitude,
    //       homeCoordinates.distance
    //     );
    //     ws.send(JSON.stringify(result));
    //   } catch (error) {
    //     console.error("Client didn't send proper home coordinates!");
    //   }
    // } else if (message.methode === "saveSelection") {
    //   try {
    //     await saveFavorites(message.selectedLine);
    //   } catch (error) {}
    // }
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

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}!`);
});
