const Y = require('yjs');
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
let s3 = require("./S3Client.js");
const { pg, pgExecute } = require('./PostgresClient');
const debounce = require('lodash.debounce');
const Bucket = process.env.BUCKET;

class Persistence {
  static activeRooms = {};

  constructor() {
    this.s3 = s3;
    this.pg = pg;
    // the state is stored when the tab is closed but not on page refresh
    // (prevents a bug: the active property of room getting set to false on page refresh)
    this.storeState = debounce(this.storeState, 1000);
  }

  async getState(docName) {
    let room;

    if (!Persistence.activeRooms[docName]) {
      room = await this.getRoom(docName);
      if (!room) {
        await this.createRoom(docName);
        Persistence.activeRooms[docName] = true;

        // no state data in s3 yet
        return null;
      }

      if (!room.active) {
        await this.setActive(docName, true);
      }
    }

    let params = {
      Bucket,
      Key: docName,
    };

    let command = new GetObjectCommand(params);

    try {
      let data = await this.s3.send(command);
      return await data.Body.transformToByteArray();
    } catch (err) {
      console.log(err);
    }
  }

  async storeState(docName, state) {
    let params = {
      Bucket,
      Key: docName,
      Body: state,
    };

    let command = new PutObjectCommand(params);

    try {
      await pgExecute(async () => this.pg.room.update({ where: { name: docName }, data: { bytes: state.length } }))
      await this.s3.send(command);
    } catch (err) {
      console.log(`Could not store doc: `, err);
    }
  }

  async createRoom(docName) {
    try {
      return await pgExecute(async () => {
        return this.pg.room.create({ data: { name: docName } });
      });
    } catch {
      console.log("PG error");
      return;
    }

  }

  async getRoom(docName) {
    try {
      return await pgExecute(async () => {
        return this.pg.room.findUnique({ where: { name: docName } });
      });
    } catch {
      console.log("pg failed to get room using docName", docName);
      return;
    }
  }

  async setActive(docName, active) {
    Persistence.activeRooms[docName] = active;
    
    try {
      await pgExecute(async () => {
        return this.pg.room.update({ where: { name: docName }, data: { active } });
      });
      return;
    } catch {
      console.log("Pg error")
      return;
    }
  }
}

module.exports = Persistence;
