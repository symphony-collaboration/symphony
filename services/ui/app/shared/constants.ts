const domain = process.env.DOMAIN || "your-domain.com";

export const SYMPHONY_API = `https://${domain}/api`;
export const SYMPHONY_WS_URL = `wss://${domain}`;

export const GRAPH_CARD_BLOCKS = 7

export const MS_IN_DAY = 86400000;
export const TIME_BLOCK = (MS_IN_DAY / GRAPH_CARD_BLOCKS);
