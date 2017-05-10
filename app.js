const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
// const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.config");
const path = require("path");

var app = express();

const compiler = webpack(webpackConfig);
compiler.apply(new webpack.ProgressPlugin());

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quite: true,
    // watchContentBase: true,
    contentBase: "src",
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })
);
app.use(require("webpack-hot-middleware")(compiler));

var router = express.Router({
  caseSensitive: app.get("case sensitive routing"),
  strict: app.get("strict routing")
});

const isProduction = process.env.NODE_ENV === "production";
const isStaging = process.env.NODE_ENV === "staging";
const isDev = process.env.NODE_ENV === "development";
const port = isProduction || isStaging ? process.env.PORT : 3333;

const sessionObj = {
  secret: "yellow_submarine",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
};
if (isProduction || isDev) {
  const MemcachedStore = require("connect-memcached")(session);

  sessionObj.store = new MemcachedStore({
    hosts: ["127.0.0.1:11211"],
    secret: "your session is saved friend."
  });
}

// Session Handling
app.use(session(sessionObj));

// app.use(favicon(__dirname + "/favicon.ico"));
app.use(router);

router.get("*", (req, res) => {
  // if (!req.cookies.access_token) return res.redirect("/login");
  return res.sendFile(path.join(__dirname, "src/index.html"));
});

// Parse application/json
app.use(bodyParser.json());

/*====================================
=            Basic Logger            =
====================================*/

// app.use(morgan('tiny'));

/*=====  End of Basic Logger  ======*/

/*===========================
=            COR            =
===========================*/

// app.use(require('cors')());

/*=====  End of COR  ======*/

const server = app.listen(port, function() {
  const host = server.address().address;
  const port = server.address().port;

  const envString = isProduction ? "Production" : "Development";

  console.log(envString + " server listening at http://%s:%s", host, port);
});
//ROUTES
// require("./server/routes/proxy")(app, router);
// require("./server/routes/api")(app, express, passport);
