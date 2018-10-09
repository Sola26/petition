const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const db = require("./db");

// const csurf = require("csurf");


var cookieSession = require("cookie-session");
app.use(
  cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(csurf());
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });





app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("public"));



app.get('/', (req, res) => {
    res.redirect('/register');
});



///////////////////////////////////////////////////




function checkForUser(req, res, next) {
    if (!req.session.sigId) {
        res.redirect('/register');
    } else {
        next();
    }
}

function checkIfLoggedin(req, res, next) {
    if (req.session.sigId) {
        res.redirect('/petition');
    } else {
        next();
    }
}



//////////////////////register//////////////////////



app.get('/register', (req, res) => {

    res.render('register', {
        layout: 'main'
    })

})




app.post("/register", (req, res, next) => {
    if (!req.body.password) {
        res.render("register", {
            layout: "main",
            error: "error"
        });
    }
    db.hashPassword(req.body.password)
        .then(hashedPw => {
            db.insertNewUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPw)
                .then(result => {
                    req.session.loggedIn = true;
                    req.session.userId = result.rows[0].id;
                    req.session.first = req.body.first;
                    req.session.last = req.body.last;
                    res.redirect("/petition");

                })
                .catch(err => {
                    console.log('err in first catch: ', err);
                    res.render("register", {
                        layout: "main",
                        error: "error"
                    });
                });
        })
        .catch(err => {
            console.log("err in last catch: ", err);
        });
});



//////////////////////register//////////////////////




//////////////////////login//////////////////////



app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
    });
});


app.post('/login', (req, res) => {
    db.getPassword(req.body.email)
        .then((result) => {
            console.log("req.body.password: ", req.body.password);
            let password = result.rows[0].hashed_pw;
            console.log(password);
            db.checkPassword(req.body.password, password)
                .then((getPassword) => {
                if (getPassword) {
                    req.session.loggedIn = true;
                    res.redirect('/petition');
                } else {
                    res.render('login', {
                        layout: 'main',
                        error: 'error'
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });
});



//////////////////////login//////////////////////







//////////////////////profile//////////////////////


app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});



//////////////////////profile//////////////////////














//////////////////////petition//////////////////////



app.get('/petition', (req, res) => {

    res.render('petition', {
        layout: 'main'
    })
})






app.post('/petition', (req, res) => {
    console.log("post request sent");
    req.session.canvas = req.body.canvas;
    // console.log("saved cookies object", req.session);
    db.setSignature(req.body.canvas)
        .then(result => {
            console.log("PROMISE RESULT", result);
            res.redirect('/signed');
        })
        .catch(err => {
            console.log("ERROR in the setSignature function: ", err),
            res.render('petition', {
                layout: 'main',
                errorMessage: 'ooooops...sign first!'
            });
        });
});



//////////////////////petition//////////////////////















// app.get('/', checkForUser, (req, res) => {
//
// })





// app.get("/petition", checkForUser, (req, res) => {
//     db.checkForUser(req.body.user)
//     .then(results => {
//         req.session.user =
//     })





//////////////////////signed//////////////////////


app.get("/signed", (req, res) => {
  res.render("signed", {
    layout: "main",
    title: "My Awesome PETITION!"
  });
});


//////////////////////signed//////////////////////


















//////////////////////signers//////////////////////



app.get("/signers", (req, res) => {
db.getSigners(req.params.first, req.params.last).then(result => {
    res.render("signers", {
      layout: "main",
      title: "My Awesome PETITION!"
    });
    // console.log("result.row: ", result.row.first);
  const rows = result.rows;
})
.catch(err => {
    console.log('err in signers catch: ', err);

  res.render("signers", {
    layout: "main",
    title: "My Awesome PETITION!"
  });
});
})


//////////////////////signers//////////////////////


// app.get("/signers/:city", (req, res) => {
//     const city = req.params.city;
// db.getSignaturesByFirstAndLast(req.params.first.last).then(result => {
//   const rows = result.rows;
// });
//   res.render("signers", {
//     layout: "main",
//     title: "My Awesome PETITION!",
//     signers: "Hero"
//     city:
//   });
// });



app.listen(8080, () => {
  console.log("listening");
});
