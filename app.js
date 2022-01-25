//------------------- require liste ---------------------
require('dotenv').config();    // recuperation des variables d'environnements 
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');

//------------------------- mongoDB ---------------------------------
//const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT,   
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//-------------------------------- express ----------------------------
//const express = require('express');
//const bodyParser = require('body-parser');
// creation 
const app = express();


app.use((req, res, next) => {
  // toutes les origines, sinon 'http://localhost:8081'
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //console.log('origin');
  // contenu du header : Authorization (bear token)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content, Accept, Content-Type, Authorization');
  // methodes autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  //res.setHeader('Cross-Origin-Resource-Policy','cross-origin');  // les images sont en local ( origine differente )
  //res.setHeader('Content-Security-Policy',"default-src 'self'");
  next();  // au suivant
});



//app.use(bodyParser.json());   // body parser deprecated
app.use(express.json());        // ou body parser , on intercepte toutes les requetes json
app.use(express.urlencoded({    // pour version 4.16.0 et +
    extended: true              // encodage de l'url
  }));


//----------------- securitée ---------------------------
//const helmet = require('helmet');
app.use(helmet());

//const session = require('cookie-session');

// desactive le cache sur le navigateur
//const nocache = require('nocache');
//app.use(nocache());


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
