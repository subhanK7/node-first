const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request Made---", req.url);

  if (req.url === "/about") {
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>About section was requested</h1> ");
    res.end();
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.write("This is recieved from server.");
    res.end();
  }
});

server.listen(3000, "localhost", () => {
  console.log("Listening to the server");
});
