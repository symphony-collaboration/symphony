require('dotenv').config();

const getDashboardIp = require("./getDashbordIp.js");
const checkDashboardStatus = require('./checkDashboardStatus.js');

const SERVER = require("../../server.config.js");
const { dashboard } = require('../../server.config.js');

const setDashboardStatus = async() => {
  const ip = await getDashboardIp();
  const port = process.env.DASHBOARD_PORT;

  console.log("setting dashboard status", {ip, port});
  if (!ip || !port) return;

  try {
    const status = await checkDashboardStatus(ip, port)

    console.log({status});
    if (!status || !status.active) return;

    Object.assign(dashboard, status);
    console.log({SERVER})
  } catch(e) {
    console.log("dashboard service api request failed\n");
    return;
  }


}

module.exports = setDashboardStatus