const http = require("http")

const checkDashboardStatus = async(target, port) => {
  const headers = {
    hostname: target,
    port,
    path: `/api/events/clients`,
    method: 'GET',
  };

  console.log({headers});

  return await new Promise((resolve, reject) => {
    const req = http.request(headers, (res) => {
      let data = ''
    
      res.on('data', chunk => data += chunk);

      res.on('end', () => {
        const parsedData = JSON.parse(data);
        resolve(parsedData)
      });
    });

    req.on('error', (error) => {
      console.error(`Error checking dashboard status: checkDashboardStatus()\n`);
      reject();
    });
    
    req.end();
  })
}

module.exports = checkDashboardStatus;
