const k8s = require("@kubernetes/client-node");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sCoreV1Api = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsV1Api = kc.makeApiClient(k8s.AppsV1Api);

const destroyService = async (name) => {
  try {
    console.log("Destroying Service: ", name)
    return await k8sCoreV1Api.deleteNamespacedService(name, "rooms");
  } catch (error) {
    if (error.body.code !== 404) {
      throw new Error(`Service ${name} could not be deleted.`);
    }
  }
};

const destroyDeployment = async (name) => {
  try {
    console.log('destroying deployment: ', name);
    await k8sAppsV1Api.deleteNamespacedDeployment(name, "rooms");
  } catch (error) {
    if (error.body.code !== 404) {
      throw new Error(`Deployment ${name} could not be deleted.`);
    }
  }
};

const closeRoom = async () => {
  const serviceName = `symphony-${process.env.ROOM_ID}`;

  console.log("CLOSE ROOM_ID: ", process.env.ROOM_ID);

  await destroyService(serviceName);
  await destroyDeployment(serviceName);
};

const k8sClient = { closeRoom };


module.exports = k8sClient;
