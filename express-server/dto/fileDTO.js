const db = require("../db/db");

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

function readPdfInfo(params) {
  let sql = `select * from api_pageconnection ap where ap.pdf_file_id = ?;`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

function readPdfUrl(params) {
  let sql = `select ap.url from api_pdffile ap where ap.id =?;`;
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, rows, fields) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  insertPdfInfo,
  readPdfInfo,
  readPdfUrl,
};
