/** @module roomsAPI */

const { pg, pgExecute } = require('../PostgresClient');
const roomsRouter = require('express').Router();

/** Get all rooms from the database */
roomsRouter.get("/rooms", async (req, res) => {
  const allRooms = await pgExecute(async () => {
    return pg.room.findMany();
  });

  /** @returns {json} array of room objects */
  res.send(allRooms);
})

module.exports = roomsRouter;
