/** @module connectionsAPI */
const { pg, pgExecute } = require("../PostgresClient");
const connectionsRouter = require('express').Router();

/** Get latest connection for each room */
connectionsRouter.get("/connections/latest", async (req, res) => {
  const connections = await pgExecute(async () => {
    return pg.connection.findMany({ distinct: ["roomName"], orderBy: { id: "desc" } });
  });

  /** @returns {json} array of connection objects */
  res.send(connections);
});

/** Get connections in the last 24 hours */
connectionsRouter.get("/connections/since_yesterday/:hour", async (req, res) => {
  const hour = Number(req.params.hour);
  let today = new Date();
  today.setHours(hour, 0, 0);
  let yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const connections = await pgExecute(async () => {
    return pg.connection.findMany({ where: { timestamp: { gte: yesterday } } });
  });
  
  /** @returns {json} array of connection objects */
  res.send(connections);
});

module.exports = connectionsRouter;
