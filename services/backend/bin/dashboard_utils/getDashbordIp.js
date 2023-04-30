const AWS = require('aws-sdk');

const region = process.env.REGION || 'us-east-1'
AWS.config.update({ region, });

const ecs = new AWS.ECS();

const clusterName = process.env.DASHBOARD_CLUSTER || 'DemoCluster';
const serviceName = process.env.DASHBOARD_SERVICE || 'SymDashboard';

const getAllTasksForService = async () => {
  try {
    const listTasksParams = {
      cluster: clusterName,
      serviceName: serviceName,
    };

    const listTasksResponse = await ecs.listTasks(listTasksParams).promise();
    const taskArns = listTasksResponse.taskArns;

    if (taskArns.length === 0) {
      console.log('No tasks found for the dashboard service.');
      return;
    }
    
    const describeTasksParams = {
      cluster: clusterName,
      tasks: taskArns,
    };

    const describeTasksResponse = await ecs.describeTasks(describeTasksParams).promise();
    const tasks = describeTasksResponse.tasks;

    const privateIpAddresses = tasks.map(task => {
      const networkInterface = task.attachments.find(attachment => attachment.type === 'ElasticNetworkInterface');
      const privateIpDetail = networkInterface.details.find(detail => detail.name === 'privateIPv4Address');
      return privateIpDetail.value;
    });

    return privateIpAddresses[0];
  } catch (error) {
    console.error('Error fetching tasks for the', `${serviceName}\n\n`, error);
    if (error.code === 'ServiceNotFoundException') {
      console.log("dashboard service not running");
      return;
    }
    
    throw error;
  }
};

module.exports = getAllTasksForService;