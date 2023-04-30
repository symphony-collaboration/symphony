export type RoomId = string;

export type ServiceName = string;

type RoomStatus = "ok" | "error";

export type RoomMetadata = {
  status: RoomStatus;
  roomId: RoomId;
  serviceName: ServiceName;
};

export type RoomSecrets = {
  postgresDbName: string;
  postgresPrivateIp: string;
  postgresUsername: string;
  postgresPassword: string;
};
