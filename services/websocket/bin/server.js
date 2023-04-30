#!/usr/bin/env node

/**
 * @type {any}
 */

require("dotenv").config();

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const roomsRouter = require("../src/router/rooms");
const connectionsRouter = require("../src/router/connections");
const eventsRouter = require("../src/router/events");
const cors = require("cors");
let Persistence = require("../src/Persistence.js");
const storage = new Persistence();
const blocked = require("blocked-at");
const promClient = require("prom-client");

// PROMETHEUS

const register = new promClient.Registry();
register.setDefaultLabels({
  roomId: process.env.ROOM_ID,
});
promClient.collectDefaultMetrics({ register });

const connectedClients = new promClient.Gauge({
  name: "number_of_connected_clients",
  help: "Number of connected clients",
  collect() {
    this.set(wss.clients.size);
  },
});
register.registerMetric(connectedClients);

// STACK INSPECTION

// blocked((time, stack) => {
//   console.log(`Blocked for ${time}ms, operation started here:`, stack)
// })

app.get("/", (request, response) =>
  response.status(200).send(`Room with id ${process.env.ROOM_ID} is online`)
);
app.get("/ready", (request, response) => {
  return response.status(200).end()
})
app.get("/health", (request, response) => {
  return response.status(200).end()
})

app.get("/metrics", async (request, response) => {
  response.setHeader("Content-Type", register.contentType);
  return response.end(await register.metrics());
});

app.use(cors());
app.use(express.json());
app.use("/api", roomsRouter);
app.use("/api", connectionsRouter);
app.use("/api", eventsRouter);

const httpServer = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

const setupWSConnection = require("./utils.js").setupWSConnection;

const port = process.env.PORT || 8081;

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

httpServer.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = (ws) => {
    wss.emit("connection", ws, request);
  };

  console.log("Received upgrade request");
  wss.handleUpgrade(request, socket, head, handleAuth);
});

httpServer.listen(port, () => {
  console.log(`server running at on port ${port}`);
});
