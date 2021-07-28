const { response } = require("express");
const fs = require("fs");
const User = require("../models/user");
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");

const deleteFsImage = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const setEntityImage = async (collecType, id, fileName) => {
  let oldImgPath = "";
  switch (collecType) {
    case "doctors":
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return false;
      }
      oldImgPath = `./uploads/doctors/${doctor.image}`;
      deleteFsImage(oldImgPath);
      doctor.image = fileName;
      await doctor.save();
      return true;

      break;
    case "hospitals":
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return false;
      }
      oldImgPath = `./uploads/hospitals/${hospital.image}`;
      deleteFsImage(oldImgPath);
      hospital.image = fileName;
      await hospital.save();
      return true;

      break;
    case "users":
      const user = await User.findById(id);
      if (!user) {
        return false;
      }
      oldImgPath = `./uploads/users/${user.image}`;
      deleteFsImage(oldImgPath);
      user.image = fileName;
      await user.save();
      return true;

      break;

    default:
      return res.status(400).json({ ok: false, error: "No existe" });
  }
};

module.exports = {
  setEntityImage,
};
