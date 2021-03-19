const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

//express 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

//express 라우팅
const usersRouter = require("./routes/users");
app.get("/", (req, res) => {
  res.send("MySurpin server connected");
});
app.use("/user", usersRouter);

app.listen(4000, () => {
  console.log("server working now on localhost:4000");
});

//HTTPS 서버 여는 코드
// const ca = fs.readFileSync(process.env.SSL_CA);
// const key = fs.readFileSync(process.env.SSL_PRIVATE);
// const cert = fs.readFileSync(process.env.SSL_CERT);

// if (ca && key && cert) {
//   https
//     .createServer(
//       {
//         ca,
//         key,
//         cert,
//       },
//       app
//     )
//     .listen(443, () => {
//       console.log("server working now");
//     });
// } else {
//   console.log("key's location is not exists");
// }
