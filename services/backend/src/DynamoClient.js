const SERVER = require("../server.config.js");

require("dotenv").config();
const AWS = require("aws-sdk");

const TableName = process.env.DYNAMO_TABLE || "rooms";
const region = process.env.REGION || 'us-east-1';

const dynamoDB = new AWS.DynamoDB({
  region,
});

const addFirstRoomIp = async(docName) => {
  const ip = SERVER.ip;

  const params = {
    TableName,
    Item: {
      id: {
        S: docName
      },
      remoteDocs: { SS: [ip] }
    },
    ConditionExpression: 'attribute_not_exists(remoteDocs) OR contains(remoteDocs, :val)',
    ExpressionAttributeValues: {
      ':val': { S: ip }
    }
  }

  await dynamoDB.putItem(params).promise();
}

const appendRoomIp = async(docName) => {
  const ip = SERVER.ip;

  const params = {
    TableName,
    Key: {
      id: { S: docName}
    },
    UpdateExpression: 'ADD remoteDocs :ip',
    ConditionExpression: 'attribute_exists(remoteDocs) AND NOT contains(remoteDocs, :ip)',
    ExpressionAttributeValues: {
      ':ip': { SS: [ip] }
    }
  }

  await dynamoDB.updateItem(params).promise();
}


// Can not create item with 1 element string set or append an element to the string set in one command
const updateRoomIps = async(docName) => {
  try {

    //  more likely to not be the first user
    return await appendRoomIp(docName);
  } catch {
    try {

      // create item and initiallze with string set if first user
      return await addFirstRoomIp(docName)
    } catch(e) {
      console.log("failed appendRoomIp() && addFirstRoomIp()", {e})
      throw e
    }
  }
}

// remove ip from string set.
const deleteRoomIp = async(docName) => {
  const ipToRemove = SERVER.ip
  const params = {
    TableName,
    Key: {
      id: { S: docName }
    },
    UpdateExpression: 'DELETE remoteDocs :ipToRemove',
    ConditionExpression: 'attribute_exists(id) AND contains(remoteDocs, :val)',
    ExpressionAttributeValues: {
      ':ipToRemove': { SS: [ipToRemove.trim()] },
      ':val': { S: ipToRemove }
    }
  };

  try {
    await dynamoDB.updateItem(params).promise();
  } catch(e) {
    if (e.code !== 'ConditionalCheckFailedException') {
      throw e
    }
  }
}

const getRoomIps = async(room) => {
  const params = {
    TableName, 
    Key: {
      id: { S: room }
    },
  }

  try {
    const {Item: item} = await dynamoDB.getItem(params).promise();

    if (!item) return;

    const  { remoteDocs } = item;
  
    if (!remoteDocs) return;
    const { SS: ips } = remoteDocs;
  
    return ips;
  } catch(e) {
    console.log("dynamo get Ips failed", {e});
    throw e
  }

}

module.exports = {
  getRoomIps,
  updateRoomIps,
  deleteRoomIp,
}