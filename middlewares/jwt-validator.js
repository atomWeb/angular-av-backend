const { response } = require("express");
const jwt = require("jsonwebtoken");

const jwtValidator = (req, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: "No existe token",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);
    req.uid = uid;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      ok: false,
      error: "Token incorrecto",
    });
  }
};

module.exports = {
  jwtValidator,
};
