require("dotenv").config();
const { default: axios } = require("axios")

const { SERVER } = require("../server.config.js");

const changeDashboardStatus = async(serverIp, status) => {
  const port = process.env.PORT;
  const servicePort = process.env.PUB_SUB_SERVICE_PORT;

  const remoteServerUrl = `http://${serverIp}:${servicePort}/api/dashboard`
  const eventsUrl = `http://${SERVER.ip}:${port}/api/events`;

  console.log("CHANGING DASHBOARD STATUS", {status, remoteServerUrl, eventsUrl});

  const data = {
    active: status,
    eventsUrl,
  }

  const res = await axios.put(remoteServerUrl, data);

  if (!res.data) throw new Error("Current connections data not received from running ws servers");
  return res.data;
}

module.exports = changeDashboardStatus