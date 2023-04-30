require("dotenv").config();
const http = require('http');
const Y = require("yjs");

const port = process.env.PORT || 8001;

const getDocState = async(target, docName) => {
  const headers = {
    hostname: target,
    port,
    path: `/api/room?id=${docName}`,
    method: 'GET',
  };

  return await new Promise((resolve, reject) => {
    const req = http.request(headers, (res) => {
      const chunks = [];
    
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
    
      res.on('end', () => {
        const responseData = Buffer.concat(chunks);
        const encodedState = new Uint8Array(responseData.buffer, responseData.byteOffset, responseData.byteLength);
        resolve(encodedState)

      });
    });

    req.on('error', (error) => {
      console.error(`Error fetching room state: ${error.message}`);
      reject();
    });
    
    req.end();
  })
}

module.exports = getDocState

