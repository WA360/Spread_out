var express = require("express");
var router = express.Router();
const userDTO = require("../dto/userDTO");
const uath = require("../auth");

const bcrypt = require("bcrypt");
const saltRounds = 10;

// 회원 조회
router.get("/", uath.checkAuth, async (req, res, next) => {
  var users = await userDTO.getAllUser();
  if (users != null) {
    res.send(users);
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    let params = [
      req.body.email,
      // req.body.userPassword,
    ];
    var userInfo = await userDTO.login(params);
    console.log("userInfo:", userInfo);
    if (userInfo.length > 0) {
      bcrypt.compare(
        req.body.password,
        userInfo[0].password,
        function (err, result) {
          if (err) {
            console.log("여긴가?");
            res
              .status(500)
              .send({ error: "Internal Server Error", details: err.message });
            return;
          }
          if (result) {
            // console.log(result);
            const token = uath.makeToken(userInfo);
            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "strict", // 이 옵션은 CSRF 공격을 방지하는 데 도움을 줍니다.
              maxAge: 24 * 60 * 60 * 1000, // 쿠키의 만료 시간 (예: 24시간)
            });
            res.status(200).send({ result: "로그인 성공!" });
            return;
          } else {
            res.status(400).send({ result: "이메일 혹은 비밀번호 오류" });
            return;
          }
        }
      );
    } else {
      res.status(400).send({ result: "이메일 혹은 비밀번호 오류" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal Server Error", details: error.message });
    // next(err); // 필요한 경우, 오류를 다음 미들웨어로 전달할 수도 있습니다.
  }
});

// 회원가입
router.post("/signin", (req, res, next) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(req.body.email)) {
    return res.status(400).send({ error: "Invalid email format" });
  }
  try {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      if (err) {
        return console.error("Error hashing password:", err);
      }
      console.log("Hashed password:", hash);
      // 이후 해시된 비밀번호를 데이터베이스에 저장하는 등의 작업을 수행합니다.
      let params = [req.body.email, hash, req.body.name];
      try {
        let result = await userDTO.signin(params);
        console.log("결과결과: ", result);
        if (result != null) {
          res.status(200).send({ result: "가입 성공" });
        } else {
          res.status(401).send({ error: "Authentication failed" });
        }
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.status(409).send({ error: "Email already exists" });
        } else {
          res
            .status(500)
            .send({ error: "Internal Server Error", details: err.message });
        }
      }
    });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Internal Server Error", details: err.message });
    // next(err); // 필요한 경우, 오류를 다음 미들웨어로 전달할 수도 있습니다.
  }
});

// 아이디 중복 체크
router.get("/signin/checkid", async (req, res, next) => {
  try {
    let params = [req.query.email];
    var userInfo = await userDTO.checkUserId(params);
    if (userInfo.length > 0) {
      res.status(409).send({ result: "아이디 중복임" });
    } else {
      res.status(200).send({ result: "아이디 중복 아님" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal Server Error", details: error.message });
    // next(err); // 필요한 경우, 오류를 다음 미들웨어로 전달할 수도 있습니다.
  }
});

module.exports = router;
