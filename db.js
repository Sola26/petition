const spicedPg = require("spiced-pg");
const { dbUser, dbPassword } = require("./secrets");
//
const db = spicedPg(
  `postgres:${dbUser}:${dbPassword}@localhost:5432/signatures`
);




exports.getData = function getData(first, last, signature) {
    return db.query(
        `INSERT INTO save (first, last, signature) VALUES ($1, $2, $3) RETURNING id`,
        [first, last, signature]
    )
}
//
// db.query("SELECT * FROM cities")
//   .then(function(results) {
//     console.log(results.rows);``
//   })
//
exports.signers = function signers() {
    return db.query(`SELECT first, last FROM save ORDER By id ASC`);
};

exports.getNumber(name) {
    return db.query(`SELECT id FROM save ORDER BY id DESC LIMIT 1`)
        .then(num => {
            console.log("NUM :", num);
            return num.rows[0].id;
        }).catch(function(err) {
            console.log(err);
          });
}

exports.getPic = function getPic(id) {
    return db
        .query(`SELECT signature FROM save WHERE id = $1`, [id])
        .then(sig => {
            return sig.rows[0].signature;
        });
};
