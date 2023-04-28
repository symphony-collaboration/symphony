import { Construct } from "constructs";
import { KubernetesProvider } from "@cdktf/provider-kubernetes/lib/provider";
import { DataGoogleContainerCluster } from "@cdktf/provider-google/lib/data-google-container-cluster";
import { ContainerCluster } from "@cdktf/provider-google/lib/container-cluster";
import { Auth as GKEAuth } from "../.gen/modules/terraform-google-modules/google/kubernetes-engine/modules/auth";
import {
  KubernetesService,
  KubernetesServiceOptions,
} from "./kubernetes_service";
import { HelmProvider } from "@cdktf/provider-helm/lib/provider";
import { Release, ReleaseConfig } from "@cdktf/provider-helm/lib/release";

export interface KubernetesClusterOptions {
  name: string;
  region: string;
  project: string;
  resourceLabels?: { [key: string]: string };
}

export class KubernetesCluster extends Construct {
  constructor(scope: Construct, options: KubernetesClusterOptions) {
    super(scope, options.name);

    new ContainerCluster(this, "cluster", {
      name: options.name,
      location: options.region,
      project: options.project,
      enableAutopilot: true,
      resourceLabels: options.resourceLabels,
      ipAllocationPolicy: {},
      minMasterVersion: "1.25",
    });
  }

  static onCluster(scope: Construct, name: string) {
    const cluster = new DataGoogleContainerCluster(scope, "cluster", {
      name,
    });

    const auth = new GKEAuth(scope, "auth", {
      clusterName: cluster.name,
      location: cluster.location,
      projectId: cluster.project,
    });

    new KubernetesProvider(scope, "kubernetes", {
      clusterCaCertificate: auth.clusterCaCertificateOutput,
      host: auth.hostOutput,
      token: auth.tokenOutput,
    });

    new HelmProvider(scope, "helm", {
      kubernetes: {
        clusterCaCertificate: auth.clusterCaCertificateOutput,
        host: auth.hostOutput,
        token: auth.tokenOutput,
      },
    });

    return {
      installHelmChart(config: ReleaseConfig) {
        new Release(scope, config.name, config);
      },

      exposeService(options: KubernetesServiceOptions) {
        return new KubernetesService(scope, options);
      },
    };
  }
}
