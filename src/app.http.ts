import fs from "fs";
import http from "http";

const server = http.createServer((req, res) => {
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

  const responseContent = fs.readFileSync(`./public/${req.url}`, "utf-8");
  res.end(responseContent);

  res.writeHead(200, { "content-type": "text/css" });
});

const portServer = 3000;
server.listen(portServer, () => {
  console.log(`Server runnig on port ${portServer}`);
});
