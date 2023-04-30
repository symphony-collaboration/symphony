/** @module roomsAPI */

const { pg, pgExecute } = require('../PostgresClient');
const roomsRouter = require('express').Router();
const getRoomState = require("../utils/getRoomState.js");

/** Get all rooms from the database */
roomsRouter.get("/rooms", async (req, res) => {
  const allRooms = await pgExecute(async () => {
    return pg.room.findMany();
  });

  /** @returns {json} array of room objects */
  res.send(allRooms);
})

roomsRouter.get("/rooms/:id", async(req, res) => {
  const room = req.params.id;

  const storedState = await getRoomState(room);

  res.writeHead(200, {"Content-Type": "application/octet-stream"});
  res.end(Buffer.from(storedState));
})

module.exports = roomsRouter;
