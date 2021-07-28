const { response } = require("express");
const User = require("../models/user");
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");

const getAll = async (req, res = response) => {
  const searchtext = req.params.search || "";
  const regexSearch = new RegExp(searchtext, "i");

  try {
    // const users = await User.find({ username: regexSearch });
    // const doctors = await Doctor.find({ name: regexSearch });
    // const hospitals = await Hospital.find({ name: regexSearch });

    const [users, doctors, hospitals] = await Promise.all([
      User.find({ username: regexSearch }),
      Doctor.find({ name: regexSearch }),
      Hospital.find({ name: regexSearch }),
    ]);

    res.json({
      ok: true,
      users,
      doctors,
      hospitals,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const getDataCollection = async (req, res = response) => {
  try {
    const searchcollection = req.params.collectname || "";
    const searchtext = req.params.search || "";
    const regexSearch = new RegExp(searchtext, "i");

    let data = [];

    switch (searchcollection) {
      case "doctors":
        data = await Doctor.find({ name: regexSearch })
        .populate("user", "username")
        .populate("hospitals", "name");
        break;
      case "hospitals":
        data = await Hospital.find({ name: regexSearch })
        .populate("user", "username");
        break;
      case "users":
        data = await User.find({ username: regexSearch });
        break;

      default:
        return res
          .status(400)
          .json({ ok: false, error: "Colección no existe" });
    }
    res.json({
      ok: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};
module.exports = {
  getAll,
  getDataCollection,
};
