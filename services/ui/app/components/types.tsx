export interface InfoCardInterface {
  id: number;
  title: string;
  description: string;
  link: { text: string; href: string };
}

export type Room = {
  roomName: string;
  lastConnectedAt: string;
  storageSize: number;
};
