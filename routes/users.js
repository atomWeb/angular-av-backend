/*
    Ruta: /api/users
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/field-validations");
const { jwtValidator } = require("../middlewares/jwt-validator");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = Router();

// Rutas:
router.get("/", jwtValidator, getUsers);

router.post(
  "/",
  [
    check("username", "El usuario es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio y debe ser válido").isEmail(),
    validateFields,
  ],
  createUser
);

router.put(
  "/:id",
  [
    jwtValidator,
    check("username", "El usuario es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio y debe ser válido").isEmail(),
    validateFields,
  ],
  updateUser
);

router.delete("/:id", jwtValidator, deleteUser);

module.exports = router;
