const spicedPg = require("spiced-pg");
const { dbUser, dbPassword } = require("./secrets");
//
const db = spicedPg(
  `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
);
const bcrypt = require('bcryptjs');








// exports.getData = function getData(first, last, signature) {
//     return db.query(
//         `INSERT INTO signatures (first, last, email, ) VALUES ($1, $2, $3) RETURNING id`,
//          [first || null, last || null, signature || null ]);
//
// }


exports.insertNewUser = function(first, last, email, hashedPw) {
    const q = `
        INSERT INTO users
        (first, last, email, hashed_pw)
        VALUES
        ($1, $2, $3, $4)
        RETURNING id
    `
    const params = [
        first || null,
        last || null,
        email || null,
        hashedPw || null
    ]

    return db.query(q, params)
}














//
// exports.checkForUser = function checkForUser(req, res, next) {
//     if (!req.session.user) {
//         res.redirect('/petition')
//     } else {
//         next()
//     }
// }

module.exports.setSignature = function(signature) {
    //create signatures first?
    return db.query(`INSERT INTO signatures (signature) VALUES ($1) RETURNING id`,
        //this id will give us a signature
        //order is important;
        [signature || null ]
    );
};

exports.getPassword = function(usersemail) {
    const q = `SELECT hashed_pw FROM users WHERE email = $1`;
    const params = [usersemail];
    return db.query(q, params);

}




exports.getSig = function(id){
    const q = `SELECT signature FROM signatures WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

exports.getSigners = function(){
    return db.query(`SELECT first, last FROM users ORDER by id ASC`);
};

// exports.getNumber = function getNumber(name) {
//     return db.query(`SELECT id FROM signatures ORDER BY id DESC LIMIT 1`)
//         .then(num => {
//             console.log("NUM :", num);
//             return num.rows[0].id;
//         }).catch(function(err) {
//             console.log(err);
//           });
// }

exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err)
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err)
                }
                resolve(hash)
            })
        })
    })
}






exports.checkPassword = function(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err)
            } else {
                resolve(doesMatch)
            }
        })
    })
}




/////////////////////////////////////////////



// SELECT * FROM users WHERE email = $1




// {#if url}
// <a href="{{url}}">{{first}} {{last}}>
// {{else}}
