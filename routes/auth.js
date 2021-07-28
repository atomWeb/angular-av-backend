/*
    Ruta: /api/login
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/field-validations");
const { login, googleSignIn } = require("../controllers/auth");

const router = Router();

// Rutas:
router.post(
  "/",
  [
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatorio y debe ser válido").isEmail(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("token", "El token es obligatorio").not().isEmpty(),    
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
