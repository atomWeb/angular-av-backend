const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

const validateADMINROL = async (req, res = response, next) => {
  try {
    const uid = req.uid;
    const userDB = await User.findById(uid);
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        error: "Usuaroio no existe",
      });
    }
    if (userDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        error: "No tiene privilegios",
      });
    }
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
};

const validateADMINROLorSAMEUSER = async (req, res = response, next) => {
  try {
    const uid = req.uid;
    const id = req.params.id;
    const userDB = await User.findById(uid);
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        error: "Usuaroio no existe",
      });
    }
    if (userDB.role === "ADMIN_ROLE" || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        error: "No tiene privilegios",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  jwtValidator,
  validateADMINROL,
  validateADMINROLorSAMEUSER,
};
