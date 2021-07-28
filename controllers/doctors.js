const { response } = require("express");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctor");
const { generateJwt } = require("../helpers/jwt");

const getDoctors = async (req, res=response) => {
  const doctors = await Doctor.find()
                              .populate("user", "username")
                              .populate("hospitals", "name");


  res.json({
    ok: true,
    doctors,
    // uid: req.uid // Muestra el usuario que ha hecho la peticion
  });
};

const createDoctor = async (req, res = response) => {
  const uid = req.uid;
  const doctor = new Doctor({ user: uid, ...req.body });
  try {
    const doctorCreated = await doctor.save();
    res.json({
      ok: true,
      doctorCreated
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

// const updateUser = async (req, res = response) => {
//   try {
//     const uid = req.params.id;

//     const checkIfUser = await User.findById( uid );
//     if (!checkIfUser) {
//       return res.status(404).json({
//         ok: false,
//         error: "El usuario no está registrado",
//       });
//     }

//     const { password, google, email, ...fields } = req.body;
//     if (checkIfUser.email !== email) {
//       const checkIfEmail = await User.findOne({ email });
//       if (checkIfEmail) {
//         return res.status(400).json({
//           ok: false,
//           error: "Email ya registrado",
//         });
//       }
//     }
//     fields.email = email;
//     const userUpdated = await User.findByIdAndUpdate(uid, fields, {
//       new: true,
//     });

//     res.json({
//       ok: true,
//       userUpdated,
//     });
//   } catch (error) {
//     res.status(500).json({ ok: false, error: error.message });
//   }
// };

// const deleteUser = async (req, res = response) => {
//   try {
//     const uid = req.params.id;

//     const checkIfUser = await User.findById( uid );
//     if (!checkIfUser) {
//       return res.status(404).json({
//         ok: false,
//         error: "El usuario no está registrado",
//       });
//     }

//     await User.findByIdAndDelete( uid );

//     res.json({
//       ok: true,
//       msg: "Usuario eliminado correctamente.",
//     });

//   } catch (error) {
//     res.status(500).json({ ok: false, error: error.message });
//   }
// };

module.exports = {
  getDoctors,
  createDoctor
};
