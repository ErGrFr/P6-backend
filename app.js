//-------------------------------- express ----------------------------
const express = require('express');
// creation 
const app = express();

app.use(express.json());        // ou body parser , on intercepte toutes les requetes json
app.use(express.urlencoded({    // pour version 4.16.0 et +
    extended: true              // encodage de l'url
  }));

//------------------------- mongoDB ---------------------------------
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://EricG:Lolita60540@cluster0.9srzq.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//mongodb+srv://EricG:Lolita60540@cluster0.9srzq.mongodb.net/Cluster0?retryWrites=true&w=majority


app.use((req, res, next) => {
  // toutes les origines, sinon 'http://localhost:8081'
  res.setHeader('Access-Control-Allow-Origin', '*');  
  //console.log('origin');
  // contenu du header : Authorization (bear token)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // methodes autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  res.setHeader('Cross-Origin-Resource-Policy','cross-origin');  // les images sont en local ( origine differente )
  next();  // au suivant
});
//app.use(bodyParser.json());   // body parser deprecated


//----------------- securitée ---------------------------
const helmet = require('helmet');
app.use(helmet());
//const session = require('cookie-session');

// desactive le cache sur le navigateur
//const nocache = require('nocache');
//app.use(nocache());




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
