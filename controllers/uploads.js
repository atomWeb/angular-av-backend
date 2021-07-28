const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { setEntityImage } = require("../helpers/setImage");

const fileUpload = async (req, res = response) => {
  try {
    const collecType = req.params.type || "";
    const id = req.params.id || "";
    const validTypes = ["users", "doctors", "hospitals"];

    if (!validTypes.includes(collecType)) {
      return res.status(400).json({
        ok: false,
        error: "No se puede subir imagen para: " + collecType,
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok: false,
        error: "No se han podido cargar los ficheros",
      });
    }

    const file = req.files.image;
    const splitImgName = file.name.split(".");
    const fileExt = splitImgName[splitImgName.length - 1];

    const validImages = ["png", "jpg", "jpeg"];
    if (!validImages.includes(fileExt)) {
      return res.status(400).json({
        ok: false,
        error: "No se puede subir imagen tipo: ." + fileExt,
      });
    }

    const fileName = `${uuidv4()}.${fileExt}`;

    const path = `./uploads/${collecType}/${fileName}`;

    file.mv(path, (err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          error: "Error al procesar la imagen. " + err,
        });
      }

      //** Ojo validar cuando el metodo devuelva false!
      setEntityImage(collecType, id, fileName);

      res.json({
        ok: true,
        data: fileName,
      });
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
};

const showImage = (req, res = response) => {
  const collecType = req.params.type || "";
  const img = req.params.img || "";
  // No validamos el tipo, pues simplemente devolvera la imagen que no existe

  let pathImg = path.join(__dirname, `../uploads/${collecType}/${img}`);
  if (!fs.existsSync(pathImg)) {
    pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
  }
  res.sendFile(pathImg);
};

module.exports = {
  fileUpload,
  showImage,
};
