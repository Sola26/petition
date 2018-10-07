const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const spicedPg = require("spiced-pg");
const { dbUser, dbPassword } = require("./secrets");
//
const db = spicedPg(
  `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
);
const csurf = require("csurf");
////////////////cookie////////////////

var cookieSession = require("cookie-session");
app.use(
  cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(csurf());
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

////////////////cookie////////////////

// db.query("SELECT * FROM signatures")

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("public"));

///////////////////////////////

app.post("/petition", (req, res) => {
  console.log("req session: ", req.body.hidden);
  console.log("req session: ", req.session.first);
  req.session.first = req.body.first;
  res.redirect("/signed");
});

app.get("/petition", (req, res) => {
  res.render("petition", {
    layout: "main",
    title: "My Awesome PETITION!"
  });
});

app.get("/signed", (req, res) => {
  res.render("signed", {
    layout: "main",
    title: "My Awesome PETITION!"
  });
});

// app.get("/signers/:name", (req, res) => {
//   res.render("signers", {
//     layout: "main",
//     title: "My Awesome PETITION!",
//     signer: "Hero"
//   });
// });
//
// app.get("/signers/:name", function(req, res) {
//   db.getSignaturesByFirstAndLast(req.params.first.last).then(result => {
//     const rows = result.rows;
//   });
// });

app.listen(8080, () => {
  console.log("listening");
});
