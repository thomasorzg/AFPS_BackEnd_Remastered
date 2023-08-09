const uploadFile = require("../../middlewares/upload");
const fs = require("fs");
const mime = require("mime-types");

exports.upload = async (req, res) => {
  try {
    if (!fs.existsSync(__basedir + "/app/storage/files/")) {
      fs.mkdirSync(__basedir + "/app/storage/files/");
    }

    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a file!",
      });
    }

    res.status(200).send({
      message: "File has been uploaded.",
      name: req.title,
    });
  } catch (error) {
    if (error.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: error,
    });
  }
};

exports.download = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/app/storage/files/";

  res.download(directoryPath + fileName, fileName, (error) => {
    if (error) {
      res.status(500).send({
        message: error,
      });
    }
  });
};

exports.getImage = (req, res) => {
  const fileName = req.params.name;
  const filePath = __basedir + "/app/storage/files/" + fileName;

  // Verifica si el archivo existe
  if (fs.existsSync(filePath)) {
    // Obtiene el tipo MIME del archivo según la extensión
    const mimeType = mime.contentType(fileName);

    if (mimeType) {
      // Establece la cabecera de respuesta para la imagen
      res.setHeader("Content-Type", mimeType);

      // Lee el archivo de imagen y lo envía como respuesta
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.status(500).send({
        message: "Invalid MIME type for image",
      });
    }
  } else {
    res.status(404).send({
      message: "Image not found",
    });
  }
};