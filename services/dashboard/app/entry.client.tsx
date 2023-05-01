import { RemixBrowser } from "@remix-run/react";
import { Buffer } from "buffer-polyfill";
import { hydrateRoot } from "react-dom/client";

globalThis.Buffer = Buffer as unknown as BufferConstructor;

hydrateRoot(document, <RemixBrowser />);
