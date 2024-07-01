const jwt = require('jsonwebtoken'); 
const secretKey = 'jungle'; 

function checkAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("인증 토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // decoded 정보를 요청 객체에 저장
        next(); // 다음 미들웨어 또는 라우트 핸들러로 이동
    } catch (error) {
        return res.status(401).send("유효하지 않은 토큰입니다.");
    }
}

function makeToken(tokenInfo){
    const payload = { userName: tokenInfo[0].name, userId:tokenInfo[0].id, uuid:tokenInfo[0].uuid };
    return token = jwt.sign(payload, secretKey);
}

module.exports = {
    makeToken,
    checkAuth
};