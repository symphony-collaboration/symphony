import * as k8s from "@kubernetes/client-node";
import { k8sClientErrorCodes } from "./constants";
import { ServiceExistsError } from "./exception";
import type { RoomId, RoomMetadata, RoomSecrets, ServiceName } from "./types";

interface DeploymentSpecParams {
  name: string;
  namespace: string;
  containerName: string;
  containerImage: string;
  containerPort: number;
  labels: Record<string, string>;
  envs: { name: string; value?: any; valueFrom?: any }[];
}

interface ServiceSpecParams {
  name: string;
  namespace: string;
  selector: { [key: string]: string };
  ports: { port: number; targetPort: number | string }[];
}

class K8sClient {
  private k8sCoreV1Api: k8s.CoreV1Api;
  private k8sAppsV1Api: k8s.AppsV1Api;

  constructor() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    this.k8sCoreV1Api = kc.makeApiClient(k8s.CoreV1Api);
    this.k8sAppsV1Api = kc.makeApiClient(k8s.AppsV1Api);
  }

  public async createRoom(roomId: RoomId): Promise<RoomMetadata> {
    const labels = { app: "symphony-websocket", id: roomId };

    const deploymentEnvs = [
      { name: "PORT", value: "8081" },
      { name: "ROOM_ID", value: roomId },
      { name: "IDLE_PERIOD", value: "60000" },
      { name: "ENABLE_SNAPSHOTTING", value: "true" },
      { name: "SNAPSHOTTING_INTERVAL", value: "100000" },
      {
        name: "CLOUD_STORAGE_BUCKET_NAME",
        valueFrom: {
          secretKeyRef: { name: "rooms-secret", key: "cloudStorageBucketName" },
        },
      },
      {
        name: "PG_DATABASE_URL",
        valueFrom: {
          secretKeyRef: { name: "rooms-secret", key: "postgresDbUrl" },
        },
      },
      {
        name: "G_PROJECT_ID",
        valueFrom: {
          secretKeyRef: { name: "rooms-secret", key: "gProjectId" },
        },
      },
      {
        name: "G_PUB_SUB_CONNECTIONS_TOPIC_NAME",
        valueFrom: {
          secretKeyRef: {
            name: "rooms-secret",
            key: "gPubSubConnectionsTopicName",
          },
        },
      },
    ];

    const deploymentSpec = this.constructDeploymentSpec({
      name: this.constructServiceName(roomId),
      namespace: "rooms",
      containerName: "symphony-websocket",
      containerImage: "docker.io/ybirader/websocket-gcp",
      // containerImage: "europe-west2-docker.pkg.dev/fourth-elixir-380718/symphony/y-websocket-updated.slim:latest"
      containerPort: 8081,
      labels,
      envs: deploymentEnvs,
    });

    const serviceSpec = this.constructServiceSpec({
      name: this.constructServiceName(roomId),
      namespace: "rooms",
      selector: labels,
      ports: [{ port: 8081, targetPort: 8081 }],
    });

    let serviceResponse;
    let deploymentResponse;

    try {
      serviceResponse = await this.k8sCoreV1Api.createNamespacedService(
        "rooms",
        serviceSpec
      );
    } catch (error) {
      console.log("An error occured in the service response", error);
      if (error.body.code === k8sClientErrorCodes.SERVICE_EXISTS) {
        throw new ServiceExistsError(error.body.message);
      }

      throw error;
    }

    console.log("Creating room with id: ", roomId);

    try {
      deploymentResponse = await this.k8sAppsV1Api.createNamespacedDeployment(
        "rooms",
        deploymentSpec
      );
    } catch (error) {
      console.log("An error occured in the deployment response");
      console.log(error);
      // throw new Error(error.body.message);
    }

    const roomMetadata: RoomMetadata = {
      status: "ok",
      roomId,
      serviceName: serviceResponse.body.metadata.name,
    };

    return roomMetadata;
  }

  public async getRoom(roomId: RoomId): Promise<RoomMetadata | undefined> {
    const serviceName = this.constructServiceName(roomId);
    const namespace = "rooms";

    try {
      const response = await this.k8sCoreV1Api.readNamespacedService(
        serviceName,
        namespace
      );
      return {
        status: "ok",
        roomId,
        serviceName: response.body.metadata.name,
      };
    } catch (error) {
      if (error.statusCode === 404) {
        console.log(`Room with id ${roomId} does not exist`);
        return undefined;
      }

      console.log(
        `Error occurred while checking if service ${serviceName} exists in namespace ${namespace}`,
        error
      );
    }
  }

  public async isRoomReady(namespace: string, label: string): Promise<boolean> {
    try {
      const response = await this.k8sCoreV1Api.listNamespacedPod(
        namespace,
        undefined,
        undefined,
        undefined,
        undefined,
        label
      );

      return !!response.body.items?.at(0)?.status.containerStatuses?.at(0)
        ?.ready;
    } catch (error) {
      console.log("Unable to check whether pod is ready");
      throw error;
    }
  }

  public constructServiceName(roomId: RoomId): ServiceName {
    return `symphony-${roomId}`;
  }

  public constructServiceUrl(
    scheme: string,
    serviceName: ServiceName,
    namespace: string,
    port: number
  ): string {
    return `${scheme}://${serviceName}.${namespace}.svc.cluster.local:${port}`;
  }

  private constructDeploymentSpec(
    options: DeploymentSpecParams
  ): k8s.V1Deployment {
    return {
      metadata: {
        name: options.name,
        namespace: options.namespace,
      },
      spec: {
        selector: {
          matchLabels: options.labels,
        },
        replicas: 1,
        template: {
          metadata: {
            labels: options.labels,
          },
          spec: {
            containers: [
              {
                name: options.containerName,
                image: options.containerImage,
                ports: [
                  {
                    containerPort: options.containerPort,
                  },
                ],
                env: options.envs,
                imagePullPolicy: "Always",
                livenessProbe: {
                  httpGet: {
                    path: "/health",
                    port: options.containerPort,
                  },
                  initialDelaySeconds: 10,
                  periodSeconds: 10,
                },
                readinessProbe: {
                  httpGet: {
                    path: "/ready",
                    port: options.containerPort,
                  },
                },
              },
            ],
          },
        },
      },
    };
  }

  private constructServiceSpec(options: ServiceSpecParams): k8s.V1Service {
    return {
      metadata: {
        name: options.name,
        namespace: options.namespace,
      },
      spec: {
        selector: options.selector,
        ports: options.ports,
      },
    };
  }
}

export default K8sClient;
