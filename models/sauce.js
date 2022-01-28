const mongoose = require('mongoose');
const validate = require('mongoose-validator');

//------- controle saisie sauce ----------------

const checkAlphaNum = [     // pour Name, Manufacturer, mainPepper
    validate({
      validator: 'isLength',
      arguments: [3, 30],
      message: 'entre 3 et 30 caracteres',
    }),
    validate({
      validator: 'isAlphanumeric',
      passIfEmpty: false,
      message: 'caracteres alpha-numerique uniquement',
    }),
  ]
  const checkDescription = [     // pour Description
    validate({
      validator: 'isLength',
      arguments: [3, 300],
      message: 'entre 3 et 300 caracteres',
    }),
    validate({
      validator: 'isAlphanumeric',
      passIfEmpty: false,
      message: 'caracteres alpha-numerique uniquement',
    }),
  ]

// middleware de verification des valeurs saisies dans le formulaire sauce

const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true},
    name: { type: String, required: true, validate: checkAlphaNum},
    manufacturer: { type: String, required: true , validate: checkAlphaNum},
    description: { type: String, required: true, validate: checkDescription },      
    mainPepper: { type: String, required: true, validate: checkAlphaNum},       // principal ingredient épicé de la sauce
    imageUrl: { type: String, required: true },         // url de l'image de la sauce
    heat: { type: Number, required: true },             // nb entre 1 et 10 ( note )
    likes: { type: Number },                            // nb de user qui aime la sauce
    dislikes: { type: Number },                         // nb de user qui n'aime pas la sauce
    usersLiked: { type: [String] },                     // tableau de userId
    usersDisliked: {type: [String] }
});

module.exports = mongoose.model('SauceModel', sauceSchema);