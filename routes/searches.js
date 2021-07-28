/*
    Ruta: /api/all/
 */
const { Router } = require("express");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { getAll, getDataCollection } = require("../controllers/searches");

const router = Router();

// Rutas:
router.get("/:search", jwtValidator, getAll);
router.get("/collection/:collectname/:search", jwtValidator, getDataCollection);

module.exports = router;
