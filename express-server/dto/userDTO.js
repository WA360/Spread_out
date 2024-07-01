const db = require("../db");

const conn = db.connection;

function login(params) {
  let sql = `select ut.userId ,ut.name, ut.email, ut.password from jungle_user ut where ut.email = ?`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function signin(params) {
  let sql = `insert into jungle_user(email,password,name) values(?,?,?)`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) {
        console.log("에러남11");
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getAllUser() {
  let sql = `select ut.id ,ut.name from jungle_user ut`;
  return new Promise((resolve, reject) => {
    conn.query(sql, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function checkUserId(params) {
  let sql = `select ut.email from jungle_user ut where ut.email = ?`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  login,
  signin,
  getAllUser,
  checkUserId,
};
