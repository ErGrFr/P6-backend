const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true },
    name: { type: String, required: true },
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