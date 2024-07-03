require("dotenv").config();
// const AWS = require("aws-sdk");
const { S3Client } = require("@aws-sdk/client-s3");
// import AWS from "aws-sdk";
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const fileDTO = require("./dto/fileDTO");

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  contentType:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

const allowedExtensions = [".png", ".jpg", ".jpeg", ".bmp", ".pdf"];
// const allowedExtensions = [".pdf"];

const imageUploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET, // 생성한 버킷 이름을 적어주세요.
    key: (req, file, callback) => {
      const uploadDirectory = req.query.directory ?? ""; // 업로드할 디렉토리를 설정하기 위해 넣어둔 코드로, 없어도 무관합니다.
      const extension = path.extname(file.originalname);
      if (!allowedExtensions.includes(extension)) {
        // extension 확인을 위한 코드로, 없어도 무관합니다.
        return callback(new Error("wrong extension"));
      }
      callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
    },
    acl: "public-read-write",
  }),
});

const editProfileImage = async (req, res) => {
  const filePath = req.file.location; // 업로드 된 이미지 경로
  console.log("req.file:", req.file);
  if (!filePath) {
    throw new CustomError({
      status: 401,
      response: {
        message: "Invalid file path",
      },
    });
  } else {
    // let params = [req.file.originalname, 1, req.file.location];
    // const profile = await fileDTO.insertPdfInfo(params);
    // console.log(profile);
    // res.status(200).send(profile);
    res.status(200).send(req.file);
  }
};

module.exports = { imageUploader, editProfileImage };
// export default imageUploader;
