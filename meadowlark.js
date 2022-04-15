var express = require("express");
var fortune = require("./lib/fortune-cookie.js");
var app = express();

// setup handlebars view engine
var handlebars = require("express-handlebars").create({
  defaultLayout: "main",
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.set("port", process.env.PORT || 9000);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about", { fortune: fortune.fortuneCookie() });
});

// custom 404 page
app.use(function (req, res) {
  res.status(404);
  res.render("404");
});

//custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), function () {
  console.log(
    "Server started on http://localhost:" +
      app.get("port") +
      ", press Ctrl + C to terminate"
  );
});
