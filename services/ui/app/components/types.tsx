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

export type Room = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  bytes: number;
  lastConnectedAt?: string;
  active: boolean;
};
