const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

//express 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://www.mysurpin.com",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

//express 라우팅
const userRouter = require("./routes/users");
const surpinRouter = require("./routes/surpin");
const tagRouter = require("./routes/tag");
app.get("/", (req, res) => {
  res.send("MySurpin server connected");
});
app.use("/user", userRouter);
app.use("/surpin", surpinRouter);
app.use("/tag", tagRouter);

// HTTPS 서버 여는 코드
const ca = fs.readFileSync(process.env.SSL_CA);
const key = fs.readFileSync(process.env.SSL_PRIVATE);
const cert = fs.readFileSync(process.env.SSL_CERT);

if (ca && key && cert) {
  https
    .createServer(
      {
        ca,
        key,
        cert,
      },
      app
    )
    .listen(443, () => {
      console.log("server working now");
    });
} else {
  console.log("key's location is not exists");
}
