
const express = require('express');

const router = express.Router();

const User = require('../models/user');     // model user



//----------------------- gestion des users -------------------------------
// requete POST , Ajout d'un utilisateur dans la base de données
router.post('/signup', (req, res, next) => {
    //delete req.body._id;  // supression de l'id créé par node
    const newUser = new User({
        ...req.body   // spread  // title: req.body.title
    });
    User.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
});

// requete POST , verification d'un utilisateur dans la base de données,retourne l'id + token signé
router.post('/login', (req, res, next) => {
    //delete req.body._id;  // supression de l'id créé par node
    // const User = new User({
    //     ...req.body   // spread  // title: req.body.title
    // });
    // User.save()
    //     .then(() => res.status(201).json({ 
    //         message: 'Objet enregistré !',

    //     }))
    //     .catch(error => res.status(400).json({ error }));

    res.status(200).json({})
});

module.exports = router;