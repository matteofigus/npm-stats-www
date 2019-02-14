var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var express = require("express");
var http = require("http");
var morgan = require("morgan");
var path = require("path");

var app = express();

var home = require("./routes/index");
var user = require("./routes/user");

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("json spaces", 0);

app.use(morgan("dev"));
app.use(bodyParser.json({ inflate: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env"))
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// API
app.get("/~info/:repository", user.info);
app.get("/~repositories/:username", user.repositories);

// REDIR ROUTE
app.get("/~redir", function(req, res) {
  var route =
    req.query.action == "user"
      ? "/" + req.query.username
      : "/~packages/" + req.query.repositoryname;
  res.redirect(route);
});

// WEBSITE ROUTES
app.get("/", home.index);
app.get("/~packages/:repository", user.repository);
app.get("/:username", user.index);

http.createServer(app).listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
