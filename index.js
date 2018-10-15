 const express = require("express");
const app = express();
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");



app.use(bodyParser.urlencoded({ extended: false }));


app.use(
  cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
  })
);
app.use(csurf());
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("public"))

///////////////// to avoid clickjacking /////////////////
app.use(function(req, res, next) {
    res.setHeader("X-Frame-Options", "deny");
    next();
});
///////////////// to avoid clickjacking /////////////////



;



app.get('/', (req, res) => {
    res.redirect('/register');
});



///////////////////////////////////////////////////




function checkForUser(req, res, next) {
    if (!req.session.sigId) {
        res.redirect('/login');
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
                    res.redirect("/profile");

                })
                .catch(err => {
                    console.log('err in first catch: ', err);
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
                console.log("err in first catch: ", err);
            });
        })
        .catch((err) => {
            console.log("err in last catch login post: ", err);
            res.render('login', {
                layout: 'main',
                error: 'error'
            })
        });
});



//////////////////////login//////////////////////







//////////////////////profile//////////////////////


app.get("/profile", (req, res) => {

    res.render("profile", {
        layout: "main"
    });
});


app.post("/profile", (req, res) => {
   db.insertNewProfile(
       req.body.age,
       req.body.city,
       req.body.url,
       req.session.userId
   ).then(result => {
       req.session.age = result["rows"][0].age;
       req.session.city = result["rows"][0].city;
       req.session.url = result["rows"][0].url;
       res.redirect("/petition");
   });
});


//////////////////////profile//////////////////////














//////////////////////petition//////////////////////



app.get('/petition', checkIfLoggedin, (req, res) => {

    res.render('petition', {
        layout: 'main'
    })
})




app.post('/petition', (req, res) => {
    db.setSig(req.body.canvas, req.session.userId)
        .then(result => {

            req.session.signatureId = result['rows'][0].id
                console.log("signatureId", req.session.signatureId);
            res.redirect('/signed');
        })
        .catch(err => {
            console.log("ERROR in the setSig function: ", err),
            res.render('petition', {
                layout: 'main',
                errorMessage: 'ooooops...sign first!'
            });
        });
});






//////////////////////petition//////////////////////


app.get("/edit", checkIfLoggedin, (req, res) => {

   db.getFullProfile(req.session.userId).then(data => {
       res.render("editview", {
           layout: "main",
           title: "Petition",
           data: data["rows"][0]
       });
   });
});

app.post("/edit", (req, res) => {
   if (req.body.password) {
       db.hashPassword(req.body.password)
           .then(hash => {
               Promise.all([
                   db.updateUserOneWith(
                       req.session.userId,
                       req.body.first,
                       req.body.last,
                       req.body.email,
                       hash
                   ),
                   db.updateUserTwo(
                       req.session.userId,
                       req.body.age,
                       req.body.city,
                       req.body.url
                   )
               ])
                   .then(() => {
                       res.redirect("/signed");
                   })
                   .catch(err => {
                       console.log(err);
                   });
           })
           .catch(err => {
               console.log(err);
           });
   } else {
       Promise.all([
           db.updateUserOne(
               req.session.userId,
               req.body.first,
               req.body.last,
               req.body.email
           ),
           db
               .updateUserTwo(
                   req.session.userId,
                   req.body.age,
                   req.body.city,
                   req.body.url
               )
               .catch(err => {
                   console.log("err: ", err);
                   throw err;
               })
       ])
           .then(() => {
               res.redirect("/signed");
           })
           .catch(err => {
               console.log(err);
           });
   }
});




















//////////////////////signed//////////////////////


app.get("/signed", checkIfLoggedin, (req, res) => {
   db.getNumber().then(numOfSigners => {
       db.getSig(req.session.signatureId).then(sig => {
           res.render("signed", {
               layout: "main",
               message: req.session.first + " " + req.session.last,
               title: "Awesome Petition",
               numOfSigners: numOfSigners,
               sig: sig
           });
       })
       .catch(err => {
           console.log("err: ", err);
       })
       .catch(err => {
           console.log("err: ", err);
           res.redirect("/")
       })
   });
});


//////////////////////signed//////////////////////



app.post('/delete-signature', (req, res) => {
    db.deleteSignature(req.session.userId)
        .then(results => {
            res.redirect('/petition');
        }).catch((err) => {
            console.log('Error in deleteSignature: ', err.message);
        });
});











//////////////////////signers//////////////////////



app.get("/signers", checkIfLoggedin, (req, res) => {
db.allSupporter().then(result => {
    return result["rows"]
    console.log("result: ", result);
}).then(supporter => {
           res.render("signers", {
               layout: "main",
               supporter: supporter
           });
      });
})
// .catch(err => {
//     console.log('err in signers catch: ', err);
// });


//////////////////////signers//////////////////////

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/login')
})


/////////////////signers by city ///////////////////

app.get("/:city", checkIfLoggedin, (req, res) => {
   db.allSupporterByCity(req.params.city)
       .then(data => {
           console.log(data);
           return data["rows"];
       })
       .then(supporter => {
           res.render("signers", {
               layout: "main",
               supporter: supporter
           });
       }).catch(err => {
           console.log("err in signers by city: ", err);
       });
});

/////////////////signers by city ///////////////////










app.listen(process.env.PORT || 8080, () => {
  console.log("listening");
});
