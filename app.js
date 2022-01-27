//------------------- require liste ---------------------
require('dotenv').config();    // recuperation des variables d'environnements 
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
//const session = require('cookie-session');

//------------------------- mongoDB ---------------------------------
//const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT,   
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//-------------------------------- express ----------------------------

// creation 
const app = express();
    
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); //  modification securitée

app.use((req, res, next) => {
  // toutes les origines, sinon 'http://localhost:8081'
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  // contenu du header : Authorization (bear token)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // methodes autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  next();  // au suivant
});

//app.use(bodyParser.json());   // body parser deprecated
app.use(express.json());        // ou body parser , on intercepte toutes les requetes json
app.use(express.urlencoded({    // pour version 4.16.0 et +
    extended: true              // encodage de l'url
  }));



// -------------------------------------- Les Routes --------------------------------------------

//------------- gestion des routes Sauces ---------------
const saucesRoutes = require('./routes/sauces');  
app.use('/api/sauces',saucesRoutes);
//-------------- gestion des routes auth ----------------
const authRoutes = require('./routes/auth');
app.use('/api/auth',authRoutes);
//--------------- gestion route images (static) ---------
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

//--------------------------------------------------

// renvoi des infos 
module.exports = app;
