import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = 3000;

export async function startServer() {
  return app.prepare().then(() => {
    return createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(PORT, () => {
      console.log(`App running on on http://localhost:${PORT}`);
    });
  });
}
