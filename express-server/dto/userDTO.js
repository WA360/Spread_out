const db = require("../db");

const conn = db.connection;

function login(params) {
  let sql = `select au.id ,au.username , au.password from auth_user au where au.username = ?;`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function signin(params) {
  let sql = `insert into auth_user (username,password) values (?,?)`;
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
  let sql = `select au.username from auth_user au;`;
  return new Promise((resolve, reject) => {
    conn.query(sql, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function checkUserId(params) {
  let sql = `select au.username from auth_user au where au.username = ?`;
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
