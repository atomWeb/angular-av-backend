/*
    Ruta: /api/hospitals
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/field-validations");
const { jwtValidator } = require("../middlewares/jwt-validator");
const {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitals");

const router = Router();

// Rutas:
router.get("/", jwtValidator, getHospitals);

router.post(
  "/",
  [
    jwtValidator,
    check("name", "El nombre del hospital es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createHospital
);

router.put(
  "/:id",
  [
    jwtValidator,
    check("name", "El nombre del hospital es obligatorio").not().isEmpty(),
    validateFields,
  ],
  updateHospital
);

router.delete("/:id", jwtValidator, deleteHospital);

module.exports = router;
