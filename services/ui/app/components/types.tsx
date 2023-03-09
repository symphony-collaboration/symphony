export interface InfoCardInterface {
  id: number;
  title: string;
  description: string;
  link: { text: string; href: string };
}

export interface GraphCardInterface {
  id: number;
  metricName: string,
  data: any
}

export type Room = {
  roomName: string;
  lastConnectedAt: string;
  storageSize: number;
};
