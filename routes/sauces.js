const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');             // verif du token
const multer = require('../middleware/multer-cfg');     // fichier image

router.get('/', auth, saucesCtrl.getAllSauces);             // recupere toutes les sauces
router.post('/', auth, multer, saucesCtrl.createSauce);     // creation d'une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);           // recupere une sauce par id
router.put('/:id', auth, multer, saucesCtrl.modifySauce);   // modification d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);        // suppression d'une sauce
router.post('/:id/like', auth, saucesCtrl.like);            // J'aime ou j'aime pas

module.exports = router;