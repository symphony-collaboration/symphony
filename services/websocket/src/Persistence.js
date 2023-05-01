const Y = require("yjs");
const { pg, pgExecute } = require("./PostgresClient");
const debounce = require("lodash.debounce");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

class Persistence {
  static activeRooms = {};

  constructor() {
    this.pg = pg;
    this.cloudStorage = new Storage();

    // the state is stored when the tab is closed but not on page refresh
    // (prevents a bug: the active property of room getting set to false on page refresh)
    this.storeState = debounce(this.storeState, 1000);
  }

  async getState(docName) {
    let room;

    if (!Persistence.activeRooms[docName]) {
      room = await this.getRoom(docName);
      console.log("I've got a room: ", room);
      if (!room) {
        await this.createRoom(docName);
        console.log("Room created in postgres: ", docName);
        Persistence.activeRooms[docName] = true;
        // no state data in s3 yet
        return null;
      }

      if (!room.active) {
        await this.setActive(docName, true);
      }

      this.registerConnection(docName);
      console.log("connection registered");
    }

    // get state from cloud storage

    const bucketName = process.env.CLOUD_STORAGE_BUCKET_NAME;
    const key = docName;

    try {
      let [data] = await this.cloudStorage
        .bucket(bucketName)
        .file(key)
        .download();
      return new Uint8Array(data);
    } catch (error) {
      console.log("gcp", error);
    }
  }

  async storeState(docName, state) {
    const bucketName = process.env.CLOUD_STORAGE_BUCKET_NAME;

    try {
      await pgExecute(async () =>
        this.pg.room.update({
          where: { name: docName },
          data: { bytes: state.length },
        })
      );

      await this.cloudStorage.bucket(bucketName).file(docName).save(state);
    } catch (err) {
      console.log(`Could not store doc: `, err);
    }
  }

  async createRoom(docName) {
    return await pgExecute(async () => {
      return this.pg.room.create({ data: { name: docName } });
    });
  }

  async getRoom(docName) {
    return await pgExecute(async () => {
      return this.pg.room.findUnique({ where: { name: docName } });
    });
  }

  async setActive(docName, active) {
    Persistence.activeRooms[docName] = active;

    return await pgExecute(async () => {
      return this.pg.room.update({
        where: { name: docName },
        data: { active },
      });
    });
  }

  async registerConnection(docName) {
    return await pgExecute(async () => {
      return this.pg.connection.create({
        data: {
          room: {
            connect: {
              name: docName,
            },
          },
        },
      });
    });
  }
}

module.exports = Persistence;
