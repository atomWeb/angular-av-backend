/*
    Ruta: /api/uploads/
 */
const { Router } = require("express");
const expressFileUpload = require("express-fileupload");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fileUpload, showImage } = require("../controllers/uploads");

const router = Router();

router.use(expressFileUpload());

// Rutas:
router.put("/:type/:id", jwtValidator, fileUpload);
router.get("/:type/:img", showImage);

module.exports = router;
