const fetchData = require("./assController");

const getTimeStoriesHandler = async (req, res) => {
  try {
    const data = await fetchData();
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
};

const app = {
  routeHandlers: {},
  get: function (route, handler) {
    this.routeHandlers[route] = handler;
  },
  listen: function (port, callback) {
    console.log(`Listening on port: ${port}`);
    const handleRequest = (req, res) => {
      const handler = this.routeHandlers[req.url];
      if (handler) {
        handler(req, res);
      } else {
        res.statusCode = 404;
        res.end("404 - Not Found");
      }
    };

    const server = require("http").createServer(handleRequest);
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      if (callback) {
        callback();
      }
    });
  },
};

app.get("/getTimeStories", getTimeStoriesHandler);
app.listen(4000);
