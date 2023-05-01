import express, { Request, Response } from "express";
import http, { IncomingMessage } from "http";
import httpProxy from "http-proxy";
import K8sClient from "./k8s";
import { Duplex } from "stream";
import { parse } from "url";
import path from "path";
import * as dotenv from "dotenv";
import { ServiceExistsError } from "./exception";
import * as dns from "dns";

dotenv.config();

const app = express();
const server = http.createServer(app);
const proxy = httpProxy.createProxyServer({ ws: true });
const k8sClient = new K8sClient();

// Helpers

const isValidPath = (pathname: string): boolean =>
  pathname.startsWith("/rooms");

// Handle HTTP Traffic

app.get("/", (request: Request, response: Response) => {
  return response.send("Ok. Server is online.");
});

// readiness and health

app.get("/ready", (request, response) => {
  return response.status(200).end();
});
app.get("/health", (request, response) => {
  return response.status(200).end();
});

// Handle WS Proxying

server.on(
  "upgrade",
  async (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    console.log("Received upgrade request");

    const { pathname } = parse(request.url);

    // validate path is valid

    if (!isValidPath(pathname)) {
      console.log("Destroying socket");
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
      return;
    }

    const roomId = path.basename(request.url);

    let roomMetadata = await k8sClient.getRoom(roomId);

    if (roomMetadata === undefined) {
      try {
        roomMetadata = await k8sClient.createRoom(roomId);
      } catch (error) {
        if (error instanceof ServiceExistsError) {
          return;
        }
        throw new Error(error.body.message);
      }
    }

    console.log("Upgrading and proxying connection");
    console.log(`DNS Servers: `, dns.getServers());

    const targetUrl = k8sClient.constructServiceUrl(
      "ws",
      roomMetadata.serviceName,
      "rooms",
      8081
    );

    console.log(`Target Url: `, targetUrl);

    if (targetUrl === undefined) return;

    // dns.lookup(
    //   `${roomMetadata.serviceName}.rooms.svc.cluster.local`,
    //   (error, address, family) => {
    //     if (error) {
    //       console.log("Error in DNS: ", error);
    //     }
    //     console.log(`IP address: ${address}`);
    //   }
    // );

    // change polling to exponential backoff

    let alternativeTargetUrl = `${roomMetadata.serviceName}.rooms`;

    let attempts = 0;
    const MAX_ATTEMPTS = 10;
    let podStatusPoll = setInterval(async () => {
      const podReady = await k8sClient.isRoomReady("rooms", `id=${roomId}`);
      console.log(`Pod with id=${roomId} ready?: ${podReady}`);
      attempts += 1;

      if (attempts > MAX_ATTEMPTS) {
        clearInterval(podStatusPoll);
      }

      if (podReady) {
        clearInterval(podStatusPoll);

        proxy.ws(
          request,
          socket,
          head,
          {
            target: targetUrl,
            changeOrigin: true,
          },
          (error) => console.log(`Could not proxy right now: ${error}`)
        );
      }
    }, 5000);
    console.log("Proxying active...");
  }
);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server listening on localhost port ${port}.`);
});
