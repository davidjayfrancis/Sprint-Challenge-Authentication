const router = require("express").Router();
const bcrypt = require("bcryptjs");
const secrets = require("../config/secrets.js");
const Users = require("../users/users-model.js");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  let user = req.body;
  let hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user).then(saved => {
    res
      .status(201)
      .json({
        welcomeMessage: `Welcome to the club, ${saved.username}`,
        memberinfo: saved
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
});

router.post("/login", (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log(user);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        console.log("take 2");
        req.headers.authorization = token;

        res.status(200).json({ message: `Welcome, ${user.username}` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json();
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
