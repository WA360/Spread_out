const db = require("../db");

const conn = db.connection;


function getPost(){
    let sql = `select * FROM post_t `;
    return new Promise((resolve,reject)=>{
        conn.query(sql, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

function getPostDetail(postId){
    let sql = `select 
                    pt.id,
                    pt.title,
                    pt.DATE_CREATED,
                    ut.name ,
                    pt.detail 
                from 
                    post_t pt 
                join 
                    user_t ut 
                on 
                    pt.user_id = ut.uuid 
                where 
                    pt.id = ?;`;
    return new Promise((resolve,reject)=>{
        conn.query(sql,postId, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}


function writePost(post){
    let sql = `insert into post_t (title,user_id,detail) values(?,?,?)`;
    return new Promise((resolve,reject)=>{
        conn.query(sql,post, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

function writeUserPost(post){
    let sql = `insert into user_post_t (user_id,post_id) values(?,?)`;
    return new Promise((resolve,reject)=>{
        conn.query(sql,post, (err, rows, fields) => {
            if(err) reject(err);
            resolve(rows);
        });
    })
}

module.exports={
    getPost,
    getPostDetail,
    writePost,
    writeUserPost
}