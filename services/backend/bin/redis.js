require('dotenv').config();
const Redis = require("ioredis");


const config = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
};

const sub =  new Redis(config);
const pub = new Redis(config);

module.exports = {sub, pub}

