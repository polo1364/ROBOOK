const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".yml": "text/yaml; charset=utf-8"
};

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300"
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = path.join(root, pathname);
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(resolvedPath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(response, resolvedPath);
      return;
    }

    sendFile(response, path.join(root, "index.html"));
  });
});

server.listen(port, () => {
  console.log(`RO EP21 guide is running on port ${port}`);
});
