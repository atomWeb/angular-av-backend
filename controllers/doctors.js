const { response } = require("express");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctor");
const { generateJwt } = require("../helpers/jwt");

const getDoctors = async (req, res = response) => {
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
      doctorCreated,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const updateDoctor = async (req, res = response) => {
  try {
    const id = req.params.id;
    const uid = req.uid;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        ok: false,
        error: "El doctor no está registrado",
      });
    }

    const newDoctorData = {
      ...req.body,
      user: uid,
    };

    const doctorUpdated = await Doctor.findByIdAndUpdate(id, newDoctorData, {
      new: true,
    });

    res.json({
      ok: true,
      doctorUpdated,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const deleteDoctor = async (req, res = response) => {
  try {
    const id = req.params.id;
    
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        ok: false,
        error: "El doctor no está registrado",
      });
    }

    await Doctor.findByIdAndDelete(id);

    res.json({
      ok: true,
      data: "Doctor eliminado correctamente.",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
