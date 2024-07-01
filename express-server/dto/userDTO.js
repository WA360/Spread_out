const db = require("../db");

const conn = db.connection;

function login(userInfo){
    let sql = `select ut.uuid ,ut.name,ut.id,ut.password from user_t ut where ut.id = ?`;
    // let params = [userInfo.userId,userInfo.userPassword];
    return new Promise((resolve,reject)=>{
        conn.query(sql,userInfo, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

function signin(userInfo){
    let sql = `insert into user_t(id,password,name) values(?,?,?)`;
    // let params = [userInfo.userId,userInfo.userPassword,userInfo.userName];
    // console.log(userInfo);
    return new Promise((resolve,reject)=>{
        conn.query(sql,userInfo, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

function getAllUser(){
    let sql = `select ut.id ,ut.name from user_t ut`;
    return new Promise((resolve,reject)=>{
        conn.query(sql, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}



module.exports={
    login,
    signin,
    getAllUser
}