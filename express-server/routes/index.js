var express = require("express");
var router = express.Router();
var db = require("../db/db");
var elastic = require("../db/elastic");
let llm = require("../ai/llm");

/* GET home page. */
router.get("/", async function (req, res, next) {
  db.connection;
  // elastic.bootstrap();
  // let result = await elastic.find("brave");
  // console.log(result);
  // res.json({ result: result });
  res.render("index", { title: "Express" });
});
// router.get("/", llm);

module.exports = router;
