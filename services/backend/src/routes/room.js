const Y = require("yjs")
const { docs } = require("../../server.config.js");

const roomApi = (req, res) => {
  const {method, url} = req;

  console.log("in room api", {method, url})
  if (method !== "GET") return;

  const query = url.split("?").slice(1);

  if (!query.length) {
    res.writeHead(401, {'Content-Type': "text/plain"});
    res.end("id query parameter missing")
    return;
  };

  const [param, roomId] = query[0].split("=");
  
  if (param === 'id' && roomId) {
    const doc = docs.get(roomId);

    if (!doc) {
      res.writeHead(401, {'Content-Type': "text/plain"});
      res.end("Doc state not in memory");
      return;
    }
    
    const update = Y.encodeStateAsUpdate(doc)

    if (!update) {
      res.writeHead(401, {'Content-Type': "text/plain"});
      res.end("Server Error: Failed to encode Doc state as update");
      return;
    }
      
    res.writeHead(200, {"Content-Type": "application/octet-stream"});
    res.end(Buffer.from(update));
    return;
  }
}

module.exports = roomApi;