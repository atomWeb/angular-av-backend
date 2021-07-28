const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJwt } = require("../helpers/jwt");
const User = require("../models/user");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  const checkIfEmail = await User.findOne({ email });
  if (!checkIfEmail) {
    return res.status(404).json({
      ok: false,
      error: "Usuario o contraseña erroneos",
    });
  }
  //
  const validPassword = bcrypt.compareSync(password, checkIfEmail.password);
  if (!validPassword) {
    return res.status(400).json({
      ok: false,
      error: "Contraseña erronea",
    });
  }
  //
  const token = await generateJwt(checkIfEmail.id);
  //
  try {
    res.json({
      ok: true,
      data: token,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  login: login,
};
