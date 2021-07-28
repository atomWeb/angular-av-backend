const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateJwt } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  const users = await User.find({}, "username email role");

  res.json({
    ok: true,
    users,
    // uid: req.uid // Muestra el usuario que ha hecho la peticion
  });
};

const createUsers = async (req, res = response) => {
  const { username, email, password } = req.body;
  try {
    const checkIfEmail = await User.findOne({ email });
    if (checkIfEmail) {
      return res.status(400).json({
        ok: false,
        error: "El correo ya está registrado",
      });
    }
    const user = new User(req.body);

    // passwd crypt
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    //
    const token = await generateJwt(user.id);

    res.json({
      ok: true,
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const updateUser = async (req, res = response) => {
  try {
    const uid = req.params.id;

    const checkIfUser = await User.findById( uid );
    if (!checkIfUser) {
      return res.status(404).json({
        ok: false,
        error: "El usuario no está registrado",
      });
    }

    const { password, google, email, ...fields } = req.body;
    if (checkIfUser.email !== email) {
      const checkIfEmail = await User.findOne({ email });
      if (checkIfEmail) {
        return res.status(400).json({
          ok: false,
          error: "Email ya registrado",
        });
      }
    }
    fields.email = email;
    const userUpdated = await User.findByIdAndUpdate(uid, fields, {
      new: true,
    });

    res.json({
      ok: true,
      userUpdated,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const deleteUser = async (req, res = response) => {
  try {
    const uid = req.params.id;

    const checkIfUser = await User.findById( uid );
    if (!checkIfUser) {
      return res.status(404).json({
        ok: false,
        error: "El usuario no está registrado",
      });
    }

    await User.findByIdAndDelete( uid );

    res.json({
      ok: true,
      msg: "Usuario eliminado correctamente.",
    });
    
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  getUsers: getUsers,
  createUsers: createUsers,
  updateUser: updateUser,
  deleteUser: deleteUser,
};