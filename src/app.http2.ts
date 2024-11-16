import fs from "fs";
import http2 from "http2";

const server = http2.createSecureServer(
  {
    key: fs.readFileSync("./keys/server.key"),
    cert: fs.readFileSync("./keys/server.crt"),
  },
  (req, res) => {
    console.log(req.url);
    //   res.writeHead(200, { "content-type": "text/html" });
    //   res.write(`<h1>URL ${req.url} </h1>`);
    //   res.end();

    //   const data = {
    //     name: "Juan Perez",
    //     age: 33,
    //     city: "Lerdo, Durango",
    //   };
    //   res.writeHead(200, { "content-type": "application/json" });
    //   res.end(JSON.stringify(data));

    if (req.url === "/") {
      const htmlFile = fs.readFileSync("./public/index.html", "utf-8");
      res.writeHead(200, { "content-type": "text/html" });
      res.end(htmlFile);
      return;
    }

    if (req.url?.endsWith(".css"))
      res.writeHead(200, { "content-type": "text/css" });
    else res.writeHead(200, { "content-type": "application/js" });

    try {
      const responseContent = fs.readFileSync(`./public/${req.url}`, "utf-8");
      res.end(responseContent);
    } catch (error) {
      res.writeHead(404, { "content-type": "text/html" });
      res.end();
    }
  }
);

const portServer = 3000;
server.listen(portServer, () => {
  console.log(`Server runnig on port ${portServer}`);
});
