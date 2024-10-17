const express = require("express");
const morgan = require("morgan");
const { join } = require("node:path");
const app = express();
const port = 8000;
const host = "127.0.0.1";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(join(__dirname, "./public")));

const authRouter = require("./routes/auth-route");
const adminRouter = require("./routes/admin-route");

app.get("/", (request, response) => {
  response.status(200).json({
    status: "success",
    data: { message: "you are in Root" },
  });
});

app.get("/login", (request, response) => {
  response.status(200).sendFile(join(__dirname, "./view/login.html"));
});

app.get("/sign-up", (request, response) => {
  response.status(200).sendFile(join(__dirname, "./view/sign-up.html"));
});

app.use("/auth", authRouter);

app.use("/admin", adminRouter);

app.all("*", (request, response) => {
  response.status(404).json({
    status: "fail",
    data: { message: "not-found any page" },
  });
});
app.listen(port, host, () => {
  console.log(`you are listening on ${host}: ${port}`);
});
