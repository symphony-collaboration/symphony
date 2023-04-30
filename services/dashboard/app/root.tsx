import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "./tailwind.css";
import { json } from "@remix-run/node";

export async function loader() {
  return json({ env: { VARIABLE: process.env.VARIABLE } });
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Symphony",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  const data = useLoaderData()
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.process = ${JSON.stringify({
              env: data.env,
            })}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
