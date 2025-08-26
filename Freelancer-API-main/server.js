//Fundamental Requirements
const express = require('express')
const path = require('path')
const app =express();
//Additional Requirements
const router = express.Router();
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");


//Reading the files
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());


//Frontend
app.get("/", (req, res) => {
  res.render("index"); // views/index.ejs (login page)
});

app.get("/login", (req, res) => {
  res.render("index"); // Same login page
});

app.get("/register", (req, res) => {
  res.render("register"); // views/register.ejs
});




app.get("/dashboard", verifyJWT, (req, res) => {
  console.log("Decoded token:", req.user);

  const username = req.user?.UserInfo?.Username || "User";
  res.render("dashboard", { username });
});

app.get("/project", verifyJWT, (req, res) => {
  console.log("Decoded token:", req.user);

  const username = req.user?.UserInfo?.Username || "User";
  res.render("project", { username });
});

app.get("/log-time", verifyJWT, (req, res) => {
  console.log("Decoded token:", req.user);

  const username = req.user?.UserInfo?.Username || "User";
  res.render("log", { username });
});



//For the api 
//Registeration
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
 
//MiddleWare
app.use(verifyJWT);
//api
app.use("/api/projects", require("./routes/api/project"))
app.use("/log",require('./routes/api/logtime'))


app.use((req, res) => {
  res.status(404).send("404 Not Found");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
















//Listening port
app.listen(3000)