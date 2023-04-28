import { Job } from "@cdktf/provider-kubernetes/lib/job";
import { ITerraformDependable } from "cdktf";
import { Construct } from "constructs";

interface KubernetesJobOptions {
  name: string;
  imageName: string;
  command: string[];
  envs: { name: string; value?: any; valueFrom?: any }[];
  dependencies: ITerraformDependable[];
}

class KubernetesJob extends Construct {
  constructor(scope: Construct, options: KubernetesJobOptions) {
    super(scope, options.name);

    new Job(this, `${options.name}-job`, {
      dependsOn: options.dependencies,
      metadata: {
        name: options.name,
      },
      spec: {
        template: {
          metadata: {},
          spec: {
            container: [
              {
                name: options.name,
                image: options.imageName,
                command: options.command,
                env: options.envs,
              },
            ],
            restartPolicy: "Never",
          },
        },
        backoffLimit: 3,
      },
      waitForCompletion: true,
      timeouts: {
        create: "5m",
        update: "5m",
      },
    });
  }
}

export default KubernetesJob;
