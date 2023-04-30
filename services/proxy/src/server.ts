import express, { Request, Response } from "express";
import http from "http";
import httpProxy from "http-proxy";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const proxy = httpProxy.createProxyServer({ ws: true });

// Handle HTTP Traffic

app.get("/", (request: Request, response: Response) => {
  return response.send("Ok. Server is online.");
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server listening on localhost port ${port}.`);
});
