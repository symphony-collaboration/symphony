#!/usr/bin/env node

/**
 * @type {any}
 */

require("dotenv").config();

const http = require('http')
const WebSocket = require('ws')

const SERVER = require("../server.config.js");

const dashboardRouter = require("../src/routes/dashboard.js");
const roomRouter = require("../src/routes/room.js");

const setDashboardStatus = require('./dashboard_utils/setDashboardStatus.js')

const getContainerIp = require("./aws_utils/getContainerIp.js");
const { execSync } = require("child_process");

const httpServer = http.createServer();

const wss = new WebSocket.Server({ noServer: true })

const setupWSConnection = require('./utils.js').setupWSConnection

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 1234;

wss.on('connection', setupWSConnection)

httpServer.on('upgrade', (request, socket, head) => {

  const handleAuth = ws => {
    console.log({clients: wss.clients.size})

    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

httpServer.on('request', (req, res) => {
  const {url, method} = req;

  console.log("http req", {url, method})
  if (url.startsWith("/api")) {
    const restPath = url.split("/api")[1];

    console.log({restPath});

    if (restPath === "/dashboard") {
      console.log("going to dashboard router")
      dashboardRouter(req, res);
      return;
    }

    if (restPath.startsWith("/room")) {
      console.log("going to room router");
      roomRouter(req, res);
      return;
    }
  }

  if (method === "GET") {
    // healthchecks
    if (url === "/" || url === "/health") {
      res.writeHead(200, {'Content-Type': "text/plain"});
      res.end("okay");
      return;
    };
  } else {
    res.writeHead(401, {"Content-Type": "text/plain"});
    res.end("not found");
  }
})


httpServer.listen(port, host, async() => {
  console.log("Server on port", port, "on host:", host);

  const metadataStorageUrl = process.env.METADATA_DB_URL || "no metadata storage url in 'process.env.DATABASE_URL'";
  
  console.log({metadataStorageUrl});

  console.log("getting container IP");
  // save container IP in memory on startup
  SERVER.ip = await getContainerIp();
  // activate dashboard status on startup if active
  await setDashboardStatus();
});
