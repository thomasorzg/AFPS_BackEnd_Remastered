const util = require("util");
const multer = require("multer");
const fs = require("fs");
const maxSize = 2 * 1024 * 1024;
const db = require("../models");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/app/storage/files/");
  },
  filename: async (req, file, cb) => {
    let random = Math.floor(Math.random() * 1000000000);
    let extension = /[^.]+$/.exec(file.originalname);
    let filename = random + "." + extension;
    req.title = filename;

    // Funcionalidad no disponbile
    /**
     * Elimina el archivo anterior del miembro si es que existe y lo reemplaza por el nuevo
     * Nota: Esto solo funciona si se obtiene el id del miembro desde el query string de la URL
     */
    /* try {
      const memberId = req.query.id;
      const member = await db["members"].findByPk(memberId); // Busca el miembro por su id en la BD

      if (member && member.profilePicture) {
        const filePath = __basedir + "/app/storage/files/" + member.profilePicture;

        // Verifica si el archivo existe y lo elimina
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error(error);
    } */

    cb(null, req.title);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;