const { response } = require("express");
const bcrypt = require("bcryptjs");
const Hospital = require("../models/hospital");
const { generateJwt } = require("../helpers/jwt");

const getHospitals = async (req, res = response) => {
  const hospitals = await Hospital.find().populate("user", "username");

  res.json({
    ok: true,
    hospitals,
    // uid: req.uid // Muestra el usuario que ha hecho la peticion
  });
};

const createHospital = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ user: uid, ...req.body });
  try {
    const hospitalCreated = await hospital.save();
    res.json({
      ok: true,
      hospitalCreated,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const updateHospital = async (req, res = response) => {
  try {
    const id = req.params.id; // Id del hospital
    const uid = req.uid; // Id del usuario del al pasar por el jwtValidator

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        error: "El hospital no está registrado",
      });
    }

    const newHospitalData = {
      ...req.body,
      user: uid,
    };

    const hospitalUpdated = await Hospital.findByIdAndUpdate(
      id,
      newHospitalData,
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      hospitalUpdated,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const deleteHospital = async (req, res = response) => {
  try {
    const id = req.params.id;
    
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        ok: false,
        error: "El hospital no está registrado",
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      data: "Hospital eliminado correctamente.",
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
