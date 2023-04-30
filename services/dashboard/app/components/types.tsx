export interface InfoCardInterface {
  id: number;
  title: string;
  description: string;
  link: { text: string; href: string };
}

export interface GraphCardInterface {
  id: number;
  metricName: string;
  data: any;
}

export type RoomId = number

export type Room = {
  id: RoomId;
  createdAt: string;
  updatedAt: string;
  name: string;
  bytes: number;
  lastConnectedAt?: string;
  active: boolean;
};
