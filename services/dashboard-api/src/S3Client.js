const { S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3 = new S3Client({
  region: process.env.REGION,
});


module.exports = s3;
