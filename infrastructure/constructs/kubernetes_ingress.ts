import { Construct } from "constructs";
import { ITerraformDependable } from "cdktf";
import { IngressV1 } from "@cdktf/provider-kubernetes/lib/ingress-v1";

export interface KubernetesIngressOptions {
  name: string;
  namespace: string;
  host: string;
  labels: Record<string, string>;
  annotations: { [key: string]: string };
  dependencies: ITerraformDependable[];
}

export class KubernetesIngress extends Construct {
  constructor(scope: Construct, options: KubernetesIngressOptions) {
    super(scope, "ingress");

    new IngressV1(scope, options.name, {
      dependsOn: options.dependencies,
      metadata: {
        name: options.name,
        namespace: options.namespace,
        labels: options.labels,
        annotations: options.annotations,
      },
      spec: {
        defaultBackend: {
          service: {
            name: "symphony-proxy",
            port: {
              number: 8081,
            },
          },
        },
        rule: [
          {
            host: options.host,
            http: {
              path: [
                {
                  pathType: "Prefix",
                  path: "/",
                  backend: {
                    service: {
                      name: "symphony-proxy",
                      port: {
                        number: 8081,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });
  }
}
