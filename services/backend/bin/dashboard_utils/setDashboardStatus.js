require('dotenv').config();

const getDashboardIp = require("./getDashbordIp.js");
const checkDashboardStatus = require('./checkDashboardStatus.js');

const SERVER = require("../../server.config.js");
const { dashboard } = require('../../server.config.js');

const port = process.env.DASHBOARD_PORT;

const setDashboardStatus = async() => {
  try {
    const ip = await getDashboardIp();

    if (!ip || !port) return;
  
    const status = await checkDashboardStatus(ip, port)

    if (!status || !status.active) return;

    Object.assign(dashboard, status);
  } catch(e) {
    console.log("dashboard service api request failed\n");
    return;
  }


}

module.exports = setDashboardStatus