/*
    Ruta: /api/doctors
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/field-validations");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require("../controllers/doctors");

const router = Router();

// Rutas:
router.get("/", jwtValidator, getDoctors);

router.post(
  "/",
  [
    jwtValidator,
    check("name", "El nombre del doctor es obligatorio").not().isEmpty(),
    check("hospitals", "El hospital debe ser un id válido").isMongoId(), // No esta validado el array
    validateFields
  ],
  createDoctor
);

router.put(
  "/:id",
  [
    jwtValidator,
    check("name", "El nombre del doctor es obligatorio").not().isEmpty(),
    check("hospitals", "El hospital debe ser un id válido").isMongoId(), // No esta validado el array
    validateFields,
  ],
  updateDoctor
);

router.delete("/:id", jwtValidator, deleteDoctor);

module.exports = router;
