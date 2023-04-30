/** @module connectionsAPI */

const mongoClient = require('../MongoClient');
const connectionsRouter = require('express').Router();

/** Get latest connection for each room */
connectionsRouter.get("/connections/latest", async (req, res) => {
  const connections = await mongoClient.getLatest();

  /** @returns {json} array of connection objects */
  res.send(connections);
});

/** Get connections in the last 24 hours */
connectionsRouter.get("/connections/since_yesterday/:hour", async (req, res) => {
  const hour = Number(req.params.hour);
  const connections = await mongoClient.getSinceYesterday(hour);

  /** @returns {json} array of connection objects */
  res.send(connections);
});

module.exports = connectionsRouter;
