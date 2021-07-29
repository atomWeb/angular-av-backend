const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJwt } = require("../helpers/jwt");
const { verify } = require("../helpers/google-verify");
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

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;
  const { name, email, picture } = await verify(googleToken);
  try {
    const userbyEmail = await User.findOne({ email });
    let user;
    if (!userbyEmail) {
      user = new User({
        username: name,
        email,
        password: "@@@",
        image: picture,
        google: true,
      });
    } else {
      user = userbyEmail;
      user.google = true;
      // user.password = "@@@";
    }

    await user.save();
    const token = await generateJwt(userbyEmail.id);

    res.json({
      ok: true,
      data: token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ ok: false, error: "Usuario no autorizado" });
  }
};

const renewToken = async (req, res = response) => {
  try {
    const uid = req.uid;
    const token = await generateJwt(uid);
    res.json({
      ok: true,
      data: token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ ok: false, error: "Usuario no autorizado" });
  }
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
