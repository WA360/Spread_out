const db = require("../db");

const conn = db.connection;

function insertPdfInfo(params) {
  let sql = `INSERT into jungle_file (name, userId_id,url) values(?,?,?)`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  insertPdfInfo,
};
