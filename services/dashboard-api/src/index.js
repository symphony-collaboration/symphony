require("dotenv").config();
const express = require('express')
const cors = require('cors');

const { SERVER } = require("./server.config.js");
const { getContainerIp } = require("./utils/getContainerIp.js");

const roomsRouter = require('./router/rooms');
const connectionsRouter = require('./router/connections');
const eventsRouter = require('./router/events');

const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.sendStatus(200));

app.use('/api', roomsRouter);
app.use('/api', connectionsRouter);
app.use('/api', eventsRouter);

app.listen(PORT, async() => {
  console.log('dashboard api listening on port', PORT);
  console.log("dashboard api v2");

  // save container IP in memory on startup
  SERVER.ip = await getContainerIp();
})

