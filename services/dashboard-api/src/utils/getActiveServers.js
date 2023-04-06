const AWS = require('aws-sdk');

const region = process.env.REGION || 'us-east-1'
AWS.config.update({ region, });

const ecs = new AWS.ECS();

const wsClusterName = process.env.WS_CLUSTER || 'No WS_CLUSTER env';
const wsServiceName = process.env.WS_SERVICE || 'No WS_SERVICE env';

const getAllTasksForService = async () => {
  console.log({wsClusterName, wsServiceName});

  try {
    const listTasksParams = {
      cluster: wsClusterName,
      serviceName: wsServiceName,
    };

    const listTasksResponse = await ecs.listTasks(listTasksParams).promise();
    const taskArns = listTasksResponse.taskArns;

    if (taskArns.length === 0) {
      console.log('No tasks found for the service.');
      return [];
    }

    const describeTasksParams = {
      cluster: wsClusterName,
      tasks: taskArns,
    };

    const describeTasksResponse = await ecs.describeTasks(describeTasksParams).promise();
    const tasks = describeTasksResponse.tasks;

    const privateIpAddresses = tasks.map(task => {
      const networkInterface = task.attachments.find(attachment => attachment.type === 'ElasticNetworkInterface');
      const privateIpDetail = networkInterface.details.find(detail => detail.name === 'privateIPv4Address');
      return privateIpDetail.value;
    });

    console.log({privateIpAddresses})
    return privateIpAddresses;
  } catch (error) {
    console.error('Error fetching tasks for the PubSubService', error);
    if (error.code === 'ServiceNotFoundException') return [];
    
    throw error;
  }
};

module.exports = {getAllTasksForService};