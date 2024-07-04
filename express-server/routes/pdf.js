var express = require("express");
var router = express.Router();
const userDTO = require("../dto/userDTO");
const fileDTO = require("../dto/fileDTO");
// import imageUploader from "../aws";
const imageUploader = require("../aws");
const uath = require("../auth");

// 데이터 조회
// router.post("/", uath.checkAuth, async (req, res, next) => {
router.get("/", async (req, res, next) => {
  if (req.body == undefined) {
    res.status(500).send({ error: "not found req.body" });
  } else {
    const params = [req.query.pdfId];

    let connection = await fileDTO.readPdfInfo(params);
    let url = await fileDTO.readPdfUrl(params);
    // console.log("connection: ", connection);
    // console.log("url: ", url);
    if (!url.length > 0) {
      res.status(400).send({ result: "해당 번호 결과 없음" });
      return;
    }
    let result = {
      url: url[0].url,
      connection: connection,
    };
    res.status(200).send(result);
  }
});

// pdf 업로드 완료 체크(파이썬 서버에서 요청 받으)
// router.get("/check", uath.checkAuth, async (req, res, next) => {
//   var users = await userDTO.getAllUser();
//   if (users != null) {
//     res.send(users);
//   }
// });

// 키워드 검색?
// router.get("/search", uath.checkAuth, async (req, res, next) => {
//   var users = await userDTO.getAllUser();
//   if (users != null) {
//     res.send(users);
//   }
// });

// pdf 페이지 조회
// router.get("/", uath.checkAuth, async (req, res, next) => {
//   var users = await userDTO.getAllUser();
//   if (users != null) {
//     res.send(users);
//   }
// });

// router.post("/upload", imageUploader.single("pdf"), async (req, res) => {
//   const filePath = req.file.location; // 업로드 된 이미지 경로
//   if (!filePath) {
//     throw new CustomError({
//       status: 401,
//       response: {
//         message: "Invalid file path",
//       },
//     });
//   } else {
//     let params = [req.file.originalname, 1, filePath];
//     const profile = await fileDTO.insertPdfInfo(params);
//     console.log(profile);
//     let result = {
//       result: "업로드 성공!",
//       insertId: profile.insertId,
//     };
//     res.status(200).send(result);
//     // res.status(200).send(req.file);
//   }
// });

module.exports = router;
