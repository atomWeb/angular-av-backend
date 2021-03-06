require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Aplicacion
const app = express();

// CORS Config
app.use(cors());

// http Body reader and parser
app.use(express.json());

// Database
dbConnection();

// Public
app.use(express.static("public"));

// Rutas
app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/login", require("./routes/auth"));
app.use("/api/all", require("./routes/searches"));
app.use("/api/uploads", require("./routes/uploads"));

// Para servir en la ruta static una SPA, se despliega alli el contenido de dist.
// Y ademas lo siguiente:
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "public/index.html"));
// });

app.listen(process.env.PORT, () => {
  console.log("Api run on port ", process.env.PORT);
});
