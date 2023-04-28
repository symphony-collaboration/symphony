import { SymphonyClient } from "@symphony-rtc/client";

const DOMAIN_NAME = "starter.symphony.com"; // Add your domain name here

const client = new SymphonyClient(DOMAIN_NAME);

export default client;
