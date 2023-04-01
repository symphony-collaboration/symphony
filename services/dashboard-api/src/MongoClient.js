require('dotenv').config();
const mongoose = require("mongoose");
const connectionLog = require("../db/mongo/model");
const url = process.env.MONGODB_URL;

const query = async (callback) => {
  await mongoose.connect(url);

  let result;
  try {
    result = await callback();
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close();
  }

  return result;
};

const mongoClient = {
  async logConnection(room) {
    query(async () => {
      await connectionLog.collection.insertOne({
        timestamp: new Date(), metadata: { room }
      });
    });
  },

  async getLatest() {
    return await query((async () => {
      return await connectionLog.collection.aggregate([
        {
          $sort: { "metadata.room": 1, "timestamp": -1 }
        },
        {
          $group: {
            _id: "$metadata.room",
            timestamp: { $first: "$timestamp" }
          }
        }
      ]).toArray();
    }));
  },

  async getSinceYesterday(hour) {
    return await query(async () => {
      let today = new Date();
      today.setHours(hour, 0, 0);
      let yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      return await connectionLog.collection.aggregate([
        {
          $match: {
            timestamp: { $gte: yesterday, $lt: today }
          },
        },
        {
          $sort: { "timestamp": 1 }
        }
      ]).toArray();
    });
  }
};

module.exports = mongoClient;
