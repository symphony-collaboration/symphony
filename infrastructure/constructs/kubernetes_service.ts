import { Construct } from "constructs";
import { ITerraformDependable } from "cdktf";
import { DeploymentV1 } from "@cdktf/provider-kubernetes/lib/deployment-v1";
import { ServiceV1 } from "@cdktf/provider-kubernetes/lib/service-v1";

type ServiceType = "ClusterIP" | "NodePort" | "LoadBalancer" | "ExternalName";

export interface KubernetesServiceOptions {
  name: string;
  namespace: string;
  containerName: string;
  containerImage: string;
  containerPort: number;
  replicas: string;
  type?: ServiceType;
  args: string[];
  cpu?: string,
  memory?: string,
  labels: Record<string, string>;
  envs: { name: string; value?: any; valueFrom?: any }[];
  readinessPath: string;
  livenessPath: string;
  dependencies: ITerraformDependable[];
}

export class KubernetesService extends Construct {
  constructor(scope: Construct, options: KubernetesServiceOptions) {
    super(scope, options.name);

    const MINIMUM_CPU = "0.25"
    const MINIMUM_MEMORY = "0.5Gi"

    const deployment = new DeploymentV1(scope, `${options.name}-deployment`, {
      dependsOn: options.dependencies,
      metadata: {
        name: options.name,
        namespace: options.namespace,
        annotations: {
          "cloud.google.com/neg": '{"ingress": true}',
        },
      },
      spec: {
        replicas: options.replicas,
        selector: {
          matchLabels: {
            app: options.name,
          },
        },
        template: {
          metadata: {
            labels: options.labels,
          },
          spec: {
            container: [
              {
                name: options.containerName,
                image: options.containerImage,
                imagePullPolicy: "Always",
                args: options.args,
                env: options.envs,
                port: [{ containerPort: options.containerPort }],
                readinessProbe: {
                  httpGet: {
                    path: options.readinessPath,
                    port: String(options.containerPort),
                  },
                  initialDelaySeconds: 3,
                  timeoutSeconds: 3,
                },
                livenessProbe: {
                  httpGet: {
                    path: options.livenessPath,
                    port: String(options.containerPort),
                  },
                  initialDelaySeconds: 30,
                  timeoutSeconds: 3,
                },
                resources: {
                  requests: {
                    cpu: options.cpu || MINIMUM_CPU,
                    memory: options.memory || MINIMUM_MEMORY
                  }
                }
              },
            ],
          },
        },
      },
    });

    new ServiceV1(scope, `${options.name}-service`, {
      dependsOn: [deployment],
      metadata: { name: options.name, namespace: options.namespace },
      spec: {
        selector: { app: options.name },
        port: [{ port: options.containerPort }],
        type: options.type || "ClusterIP",
      },
    });
  }
}
