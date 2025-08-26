const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required." });

  //Exist
  const foundUser = userDB.users.find((person) => person.Username == user);
  if (!foundUser) return res.sendStatus(401); //umauthorized

  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.Password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //CREATE JWTS
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.Username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    //CREATE JWTS
    const refreshToken = jwt.sign(
      { username: foundUser.Username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //Save RefreshToken in db
    const otherUsers = userDB.users.filter(
      (person) => person.Username !== foundUser.Username
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Strict", // or "Lax"
      secure: false, // true if using HTTPS
      maxAge: 24 * 60 * 60 *  1000,
    });
    // res.json({ success: true });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
