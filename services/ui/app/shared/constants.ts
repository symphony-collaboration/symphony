import { DOMAIN } from "~/domain";

export const SYMPHONY_API = `https://${DOMAIN}/api`;
export const SYMPHONY_WS_URL = `wss://${DOMAIN}`;

export const GRAPH_CARD_BLOCKS = 7

export const MS_IN_DAY = 86400000;
export const TIME_BLOCK = (MS_IN_DAY / GRAPH_CARD_BLOCKS);
