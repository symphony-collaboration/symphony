/** @module eventsAPI */

const eventsRouter = require('express').Router();

let client = null;
const events = {};

function sendEventsToClient() {
  client && client.res.write(`data: ${JSON.stringify(events)}\n\n`);
};

/** Open a connection and wait for updates */
eventsRouter.get("/events", (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };

  res.writeHead(200, headers);

  const data = `data: ${JSON.stringify(events)}\n\n`;
  res.write(data);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };

  client = newClient;

  req.on("close", () => {
    client = null;
  });
});

/** Send an operation to update a rooms connections tally */
eventsRouter.post("/events", (req, res) => {
  const { room, add } = req.body;
  events[room] = events[room] || 0;
  events[room] += Number(add);

  if (events[room] === 0) delete events[room];

  res.json(events);

  return sendEventsToClient();
});

module.exports = eventsRouter;
