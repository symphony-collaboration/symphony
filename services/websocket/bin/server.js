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
