const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const csurf = require("csurf");


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





app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("public"));





app.post("/petition", (req, res) => {
  console.log("req.body session: ", req.body.hidden);
  console.log("req.session session: ", req.session.first);
  req.session.first = req.body.first;
  // res.redirect("/signed");
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

app.get("/signers/:name", (req, res) => {
db.getSignaturesByFirstAndLast(req.params.first.last).then(result => {
  const rows = result.rows;
});
  res.render("signers", {
    layout: "main",
    title: "My Awesome PETITION!",
    signer: "Hero"
  });
});



app.listen(8080, () => {
  console.log("listening");
});
