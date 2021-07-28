const jwt = require("jsonwebtoken");

const generateJwt = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid: uid,
    };

    jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        expiresIn: "12h",
      },
      (err, token) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJwt: generateJwt,
};
