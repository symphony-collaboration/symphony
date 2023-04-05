const { dashboard, docs } = require("../../server.config.js");

const dashboardApi = (req, res) => {
  if (req.method !== "PUT") return;

  console.log("being processed by dashboard router");
  let body = '';
  req.on('data', chunk => body += chunk)
  req.on('end', () => {
    
    if (!body) {
      res.writeHead(401, {'Content-Type': "text/plain"});
      res.end("Missing body");
    }
    
    const data = JSON.parse(body);
    
    if (!data.hasOwnProperty('eventsUrl') || !data.hasOwnProperty('active')) {
      console.log("no eventsUrl || active prop sent from dashboard service")
      res.writeHead(401, {'Content-Type': "text/plain"});
      res.end("Missing object properties");
    }

    dashboard.active = data.active;

    if (!data.active) {
      res.writeHead(200, {'Content-Type': "text/plain"});
      res.end("okay");
      return;
    }

    dashboard.eventsUrl = data.eventsUrl;
    
    console.log("in PUT /api/dashboard", {dashboard});
    const conns = [...docs.keys()].map(docName => {
      const docConns = {};
      docConns[docName] = docs.get(docName).conns.size
      return docConns
    })


    res.writeHead(200, {'Content-Type': "application/json"});
    res.end(JSON.stringify(conns));
    return;
  })    
}

module.exports = dashboardApi;
