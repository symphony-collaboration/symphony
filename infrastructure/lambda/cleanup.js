const AWS = require('aws-sdk');

const table = process.env.TABLE;
const region = process.env.REGION;

if (!table || !region) {
  console.log("no table or region");
  process.exit();
}

const dynamodb = new AWS.DynamoDB({
  region,
});

const removeIp = async(item, privateIp) => {
  try {
    const itemKey = { "id": item.id };
    // 
    if (!item.remoteDocs) {
      console.log("removing item b/c it has no remote docs");
      const deleteParams = {
        TableName: table,
        Key: itemKey
      }

      return await dynamodb.deleteItem(deleteParams).promise();
    }

    const remoteDocs = item.remoteDocs.SS;
    const hadDocInMemory = remoteDocs.includes(privateIp);

    if (!hadDocInMemory) {
      return;
    };

    // Remove privateIp from remoteDoc attribute
    const updateParams = {
      TableName: table,
      Key: itemKey,
      UpdateExpression: "DELETE remoteDocs :removeIp",
      ExpressionAttributeValues: {
        ":removeIp": { SS: [privateIp] }
      },
      ReturnValues: "UPDATED_NEW"
    };

    const res = await dynamodb.updateItem(updateParams).promise();
    console.log(`Removed ${privateIp} from remoteDoc attribute of ${item.id.S}`);

    if (!res.Attributes || !res.Attributes.remoteDocs) {
      console.log("removing item b/c it has no remote docs");
      const deleteParams = {
        TableName: table,
        Key: itemKey
      }

      await dynamodb.deleteItem(deleteParams).promise();
    }

    return;
  } catch(error) {
    console.log({error})
    return;
  }
};

exports.handler = async (event) => {
  const privateIp = event.detail.containers[0].networkInterfaces[0].privateIpv4Address;
  console.log({privateIp});

  const scanParams = {
    TableName: table
  };

  try {
    const scanResult = await dynamodb.scan(scanParams).promise();

    console.log(`Scanned ${scanResult.Count} items in ${table}`);

    const clearIpFromTable = scanResult.Items.map(item => removeIp(item, privateIp));

    await Promise.all(clearIpFromTable);
    console.log("DONE Clearing Ip from table");
  } catch (err) {
    console.log({err})
  }
};