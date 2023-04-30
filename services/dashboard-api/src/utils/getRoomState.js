require('dotenv').config();

const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../S3Client.js");

const Bucket = process.env.BUCKET || process.exit();

const getRoomState = async(room) => {
  let params = {
    Bucket,
    Key: room,
  };

  let command = new GetObjectCommand(params);

  try {
    let data = await s3.send(command);
    return await data.Body.transformToByteArray();
  } catch (err) {
    console.log("invalid key", err);
    return null;
  }
}

module.exports = getRoomState;