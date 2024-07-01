const db = require("../db");

const conn = db.connection;

function writeComment(comment){
    let sql = `insert into comment_t (post_id ,user_id,detail) values(?,?,?) `;
    return new Promise((resolve,reject)=>{
        conn.query(sql,comment, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

function getComment(postId){
    let sql = `
        select 
            ct.detail ,
            ut.name 
        from 
            comment_t ct
        join 
            post_t pt ON pt.id = ct.post_id 
        join 
            user_t ut ON ut.uuid = ct.user_id 
        where 
            ct.post_id = ?;`;
    return new Promise((resolve,reject)=>{
        conn.query(sql,postId, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

module.exports={
    getComment,
    writeComment
}