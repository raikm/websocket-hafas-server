//const { showNearbyStations } = require("./setup.js");

const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const createClient = require("hafas-client");
const bvgProfile = require("hafas-client/p/bvg");

const client = createClient(bvgProfile, "hafas");

const port = 3000;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("showNearbyStations", function incoming(data) {
    console.log(data);
    //TODO: showNearbyStations()
  });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    console.log("sending hi");
    ws.send("hi");
  });
}, 3000);

wss.on("close", function close() {
  clearInterval(interval);
});

server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
