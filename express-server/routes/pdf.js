var express = require("express");
var router = express.Router();
const userDTO = require("../dto/userDTO");
// import imageUploader from "../aws";
const imageUploader = require("../aws");
const uath = require("../auth");

// 데이터 조회
router.get("/", uath.checkAuth, async (req, res, next) => {
  var users = await userDTO.getAllUser();
  if (users != null) {
    res.send(users);
  }
});

// pdf 업로드 완료 체크(파이썬 서버에서 요청 받으)
router.get("/check", uath.checkAuth, async (req, res, next) => {
  var users = await userDTO.getAllUser();
  if (users != null) {
    res.send(users);
  }
});

// 키워드 검색?
router.get("/search", uath.checkAuth, async (req, res, next) => {
  var users = await userDTO.getAllUser();
  if (users != null) {
    res.send(users);
  }
});

// pdf 페이지 조회
router.get("/", uath.checkAuth, async (req, res, next) => {
  var users = await userDTO.getAllUser();
  if (users != null) {
    res.send(users);
  }
});

router.post("/test/image", imageUploader.single("image"), (req, res) => {
  res.send("good!");
});

module.exports = router;
