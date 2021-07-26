require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Aplicacion
const app = express();

// CORS Config
app.use(cors);

// Database
dbConnection();

// Rutas
app.get("/", (req, res) => {
  res.json({
    ok: true,
    msg: "Hola mundo",
  });
});

app.listen(process.env.PORT, () => {});
