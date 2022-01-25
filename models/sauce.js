const mongoose = require('mongoose');

// middleware de verification des valeurs saisies dans le formulaire sauce
//const checkdatas = require('../middleware/checkdatas');  

const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true},
    name: { type: String, required: true, match: /^[a-zA-Z0-9-_]+$/ }, // match renvoie une erreur serveur ( pas tres explicite)
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },      
    mainPepper: { type: String, required: true },       // principal ingredient épicé de la sauce
    imageUrl: { type: String, required: true },         // url de l'image de la sauce
    heat: { type: Number, required: true },             // nb entre 1 et 10 ( note )
    likes: { type: Number },                            // nb de user qui aime la sauce
    dislikes: { type: Number },                         // nb de user qui n'aime pas la sauce
    usersLiked: { type: [String] },                     // tableau de userId
    usersDisliked: {type: [String] }
});

module.exports = mongoose.model('SauceModel', sauceSchema);