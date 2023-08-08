const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "dummyProj", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.send("Invalid accessToken")
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.send("You don't have access")
  }
};

module.exports = { requireAuth };
