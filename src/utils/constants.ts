import os from "os";

export const HOME = os.homedir();
export const AWS_DIR = os.homedir() + "/.aws";
export const SYMPHONY_GLOBAL_DIR = os.homedir() + "/.symphony";

export const SYMPHONY_DEPLOY_DIR = SYMPHONY_GLOBAL_DIR + "/deploy";
export const SYMPHONY_DASHBOARD_DIR = SYMPHONY_GLOBAL_DIR + "/dashboard";

export const SYMPHONY_ENV = SYMPHONY_GLOBAL_DIR + "/.env";

export const SYMPHONY_DEPLOY_REPO = "https://github.com/symphony-hq/symphony-infrastructure.git";
export const SYMPHONY_DASHBOARD_REPO = "https://github.com/symphony-hq/symphony-ui.git";

export const SYMPHONY_DASHBORD_CONTAINER = "ojodetoro/symphony-dashboard"

export const SYMPHONY_DEPLOYMENT_ENV = {
  SYM_METADATA_DB_NAME: "SymphonyMetadata",
  SYM_INIT_METADATA_IMAGE: "ojodetoro/symphony-init-postgres",

  SYM_WS_IMAGE: "ojodetoro/symphony-ws-3",
  SYM_WS_PORT: "8001",

  SYM_DASHBOARD_IMAGE: "ojodetoro/symphony-dashboard-2",
  SYM_DASHBOARD_PORT: "8000",
  
  SYM_DASHBOARD_SERVICE_NAME: "SymphonyDashboardService",
  SYM_DASHBOARD_CLUSTER_NAME: "SymphonyDashboardCluster",
}

export const HIDE_CDK_OUTPUT = `${SYMPHONY_GLOBAL_DIR}/cdk-output.json`;