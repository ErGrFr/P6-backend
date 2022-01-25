const multer = require('multer');

// types de fichiers images gerés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {   // destination du fichier ( rep backend/images )
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //console.log(file.originalname);
    const name = file.originalname.split('.')[0];           // nom du fichier
    
    //console.log(name);
    const extension = MIME_TYPES[file.mimetype];            // on garde l'extension
    //console.log(extension);
    callback(null, name + Date.now() + '.' + extension);    // nouveau format unique ( avec date time), evite les doublons
  }
});

module.exports = multer({storage: storage}).single('image');  // pour un fichier type image