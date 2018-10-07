const spicedPg = require('spiced-pg');
const {dbUser, dbPassword} = require('./secrets');

const db = spicedPg(`postgres:${dbUser}:${dbPassword}@localhost:5432/sage`)




exports.getCityByNameAndState(name, state) {
    return db.query(
        `SELECT * FROM cities WHERE name = $1 AND state = $2`,
        [name, state]
    )
}


// db.query("SELECT * FROM cities")
//   .then(function(results) {
//     console.log(results.rows);``
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

// exports.getCityByName(name) {
//     return db.query(
//         `SELECT * FROM cities WHERE name = $1`,
//         [name]
//     )
// }
