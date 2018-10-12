// const spicedPg = require("spiced-pg");
// // const { dbUser, dbPassword } = require("./secrets");
// //
// // const db = spicedPg(
// //   `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
// // );
// const bcrypt = require('bcryptjs');
//
//
// let dbUrl;
//
// let secrets;
// if (process.env.NODE_ENV === 'production') {
//     secrets = process.env;
//     dbUrl = secrets.DATABASE_URL;
// } else {
//     secrets = require('./secrets.json')
//     dbUrl =`postgres:${secrets.dbUser}:${secrets.dbPassword}@localhost:5432/signatures`;
// }
//
// const db = spicedPg(dbUrl)
const spicedPg = require("spiced-pg");
//this when we create a secret.json with password and stuff, for git ignore
// const { dbUser, dbPassword } = require('./secrets');

let secrets;
let dbUrl;
//if production the first, if development the second db will be activated;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
    dbUrl = process.env.DATABASE_URL;
} else {
    secrets = require("./secrets");
    dbUrl = `postgres://${secrets.dbUser}:${
        secrets.dbPassword
    }@localhost:5432/signatures`;
}

const bcrypt = require("bcryptjs");
// const { dbUser, dbPassword } = require("./secrets");
const db = spicedPg(dbUrl);



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



exports.insertNewProfile = function insertNewProfile(age, city, url, user_id) {
   const q = `
INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
   const params = [age || null, city || null, url || null, user_id];
   return db.query(q, params);
};


exports.updateUserOneWith = function(id, first, last, email, hashPassword) {
   const q = `
   UPDATE users
   SET first = $2, last = $3, email = $4, password = $5
   WHERE id = $1;
   `;
   const params = [
       id || null,
       first || null,
       last || null,
       email || null,
       hashPassword || null
   ];

   return db.query(q, params);
};

exports.updateUserOne = function(id, first, last, email) {
   const q = `
   UPDATE users
   SET first = $2, last = $3, email = $4
   WHERE id = $1;
   `;
   const params = [id || null, first || null, last || null, email || null];

   return db.query(q, params);
};

exports.updateUserTwo = function(id, age, city, url) {
   const q = `
   INSERT INTO user_profiles (user_id, age, city, url)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (user_id)
   DO UPDATE SET user_id = $1, age = $2, city = $3, url = $4;
   `;
   const params = [id || null, age || null, city || null, url || null];

   return db.query(q, params);
};
exports.getFullProfile = function getFullProfile(id) {
   return db.query(
       `SELECT users.first AS first_name, users.last AS last_name, users.email AS email,signatures.signature AS signature, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
FROM signatures
JOIN users
ON signatures.user_id = users.id
LEFT JOIN user_profiles
ON signatures.user_id = user_profiles.user_id
WHERE user_profiles.user_id = $1`,
       [id]
   );
};


exports.allSupporterByCity = function(city) {
   return db.query(
       `SELECT users.first AS first_name, users.last AS last_name, user_profiles.user_id,user_profiles.age AS age, user_profiles.url AS url
       FROM users
       JOIN user_profiles
       ON users.id = user_profiles.user_id
       JOIN signatures
       ON users.id = signatures.user_id
       WHERE LOWER(city) = LOWER($1);
       `,
       [city]
   );
};










    exports.getPassword = function(usersemail) {
        const q = `SELECT hashed_pw FROM users WHERE email = $1`;
        const params = [usersemail];
        return db.query(q, params);

    }








    exports.setSig = function(signature, user_id) {
        const q = `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id`
        const params = [ signature || null, user_id || null ]
        return db.query(q, params)

        };





        exports.getSig = function getPic(id) {
       return db
           .query(`SELECT signature FROM signatures WHERE id = $1`, [id])
           .then(sig => {
               return sig.rows[0].signature;
           });
    };

    exports.allSupporter = function allSupporter() {
       return db.query(`SELECT users.first AS first_name, users.last AS last_name, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS url
    FROM signatures
    JOIN users
    ON signatures.user_id = users.id
    LEFT JOIN user_profiles
    ON signatures.user_id = user_profiles.user_id`);
    };


exports.getNumber = function() {
   return db
       .query(`SELECT COUNT (*) FROM signatures`)
       .then(result => {
           return result.rows[0].count;
       })
       .catch(function(err) {
           console.log(err);
       });
};

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
