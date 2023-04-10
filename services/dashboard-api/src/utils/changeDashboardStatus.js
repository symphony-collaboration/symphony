require("dotenv").config();
const { default: axios } = require("axios")

const { SERVER } = require("../server.config.js");

const changeDashboardStatus = async(wsServerIp, status) => {
  const port = process.env.PORT;
  const wsPort = process.env.WS_PORT;

  const wsServerUrl = `http://${wsServerIp}:${wsPort}/api/dashboard`
  const eventsUrl = `http://${SERVER.ip}:${port}/api/events`;

  const data = {
    active: status,
    eventsUrl,
  }

  const res = await axios.put(wsServerUrl, data);

  if (!res.data) throw new Error("Current connections data not received from running ws servers");
  return res.data;
}

module.exports = changeDashboardStatus