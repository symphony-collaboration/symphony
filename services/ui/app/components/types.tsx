export interface InfoCardInterface {
  id: number;
  title: string;
  description: string;
  link: { text: string; href: string };
}

export interface GraphCardInterface {
  id: number;
  metricName: string;
  metricData: any;
}

export type SeenRoom = {
  [key: string]: boolean
}

export type Room = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  bytes: number;
  lastConnectedAt?: string;
  active: boolean;
};

export type Connection = {
  id: number;
  roomName: string,
  timestamp: Date,
}

export type RoomConnections = {
  name: string,
  conns: number,
}
