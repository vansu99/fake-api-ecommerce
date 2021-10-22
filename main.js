const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const queryString = require("query-string");
const bodyParser = require("body-parser");
const fs = require("fs");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    (req.body.createdAt = Date.now()), (req.body.updatedAt = Date.now());
  } else if (req.method === "PATCH") {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCountHeader = headers["x-total-count"];
  if (req.method === "GET" && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);
    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 20,
        _totalRows: Number.parseInt(totalCountHeader),
          link: `https://fake-api-ecom.herokuapp.com/api/products?_page=${Number.parseInt(queryParams._page)}`
      },
    };
    return res.jsonp(result);
  }

  res.jsonp(res.locals.data);
};

// Use default router
server.use("/api", router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("JSON Server is running at Port 3000");
});
