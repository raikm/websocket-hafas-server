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
  client
    .nearby(
      {
        type: "location",
        latitude: 52.535516,
        longitude: 13.406638,
      },
      { distance: 1000 }
    )
    .then(console.log);
  ws.on("message", function incoming(data) {
    console.log("message: " + data);
  });
  ws.send("something");
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

// const server = exposeHafasClient(httpServer, hafas);
// console.log("hafas-websocket-server running");
