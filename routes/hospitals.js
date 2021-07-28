/*
    Ruta: /api/hospitals
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/field-validations");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { getHospitals, createHospital } = require("../controllers/hospitals");

const router = Router();

// Rutas:
router.get("/", jwtValidator, getHospitals);

router.post(
  "/",
  [
    jwtValidator,
    check("name", "El nombre del hospital es obligatorio").not().isEmpty(),
    validateFields
  ],
  createHospital
);

// router.put(
//   "/:id",
//   [
//     jwtValidator,
//     check("username", "El usuario es obligatorio").not().isEmpty(),
//     check("email", "El email es obligatorio y debe ser válido").isEmail(),
//     validateFields,
//   ],
//   updateUser
// );

// router.delete("/:id", jwtValidator, deleteUser);

module.exports = router;
