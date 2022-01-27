
// userId: { type: String, required: true },
// name: { type: String, required: true },
// manufacturer: { type: String, required: true },
// description: { type: String, required: true },      
// mainPepper: { type: String, required: true },       // principal ingredient épicé de la sauce
// imageUrl: { type: String, required: true },         // url de l'image de la sauce
// heat: { type: Number, required: true },             // nb entre 1 et 10 ( note )
// likes: { type: Number, required: true },            // nb de user qui aime la sauce
// dislikes: { type: Number, required: true },         // nb de user qui n'aime pas la sauce
// usersLiked: { type: Number, required: true },       // chaine de userId

//-----------------------------------------------------------------------------------
//------------------------------ gestion des sauces ---------------------------------
//-----------------------------------------------------------------------------------

const Sauce = require('../models/sauce');

const fs = require('fs');  // file system, pour supprimer l'image local

//-----------------------------------------------------------------------------------
//---------------------------- création d'une sauce ---------------------------------
//-----------------------------------------------------------------------------------
exports.createSauce = async function (req, res, next) {

  // On stock les datas du frontend
  const maSauce = JSON.parse(req.body.sauce);
  //console.log(maSauce);

  // création de l'objet sauce ( model sauce)
  const newSauce = new Sauce({
    ...maSauce,   // recuperation des datas de maSauce ( frontend )
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // http://localhost:3000/images/nom.jpg
    likes: 0,     // init a zero, car nouvelle sauce
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  console.log(newSauce);
  const saveSauce = await newSauce.save()
  .then( () => {
      res.status(201).json({
        message: 'Sauce saved successfully!'
      });
    }
  ).catch( (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
//----------------------------------------------------------------------------------------
//--------------------------------- recupere une sauce par id ----------------------------
//----------------------------------------------------------------------------------------
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
//--------------------------------------------------------------------------------
//-------------------------- modification d'une sauce ----------------------------
//--------------------------------------------------------------------------------
exports.modifySauce = (req, res, next) => {

  if (req.file){  // si req.file existe ( modification de l'image)
    
      Sauce.findOne({_id: req.params.id})  // recherche la sauce a modifier pour supprimer l'ancienne image
      .then( sauce => {
      
        const filename = sauce.imageUrl.split('/images/')[1]; // recuperation du nom de l'image
  
        fs.unlinkSync(`images/${filename}`);//, (err) => {  // suppression du fichier local ( SYNC )
    
          const maSauce = {
            ...JSON.parse(req.body.sauce),
            imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // MAJ nouvelle image
          }
          // sauvegarde dans la BDD
          Sauce.updateOne({_id: req.params.id}, {...maSauce, _id:req.params.id})
            .then( () => res.status(201).json({message: 'Sauce updated successfully!'}))
            .catch((error) => res.status(400).json({error: error}));
        //});     
      })
      .catch(error => res.status(400).json({error}))

  } else { // si req.file n'existe pas , on passe a la maj simple
    // sauvegarde dans la BDD
    const maSauce = {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...maSauce, _id:req.params.id})
    .then( () => res.status(201).json({message: 'Sauce updated successfully!'}))
    .catch((error) => res.status(400).json({error: error}));
  };  
  
};
//-----------------------------------------------------------------------------------
//---------------------------- supression d'une sauce ------------------------------
//----------------------------------------------------------------------------------
exports.deleteSauce = (req, res, next) => {
  // suppression du fichier image local
  //console.log(req.params.id);
  Sauce.findOne({_id: req.params.id})
    .then( sauce => {
      //console.log(sauce);
      const filename = sauce.imageUrl.split('/images/')[1];
      //console.log(filename);
      fs.unlink(`images/${filename}`, () => {       // suppression du fichier local et de la sauce
        Sauce.deleteOne({_id: req.params.id})
        .then( () => {
            res.status(200).json({message: 'Sauce Deleted!'});
          })
        .catch( (error) => {
            res.status(400).json({error: error});
          }
        );

      });
    })
    .catch(error => res.status(400).json({error}))
  
};
//-----------------------------------------------------------------------
//--------------------- recupere toutes les sauces ----------------------
//-----------------------------------------------------------------------
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({error: error});
    }
  );
};

//-----------------------------------------------------------------------
//----------------- Like ou dislike -------------------------------------
//-----------------------------------------------------------------------
// like = 1 , dislike = -1 , rien = 0
exports.like = (req, res , next) => {

  console.log(req.body);
  console.log(req.params);
  //res.status(200).json({message: 'like'});
  let like = req.body.like;         // on recupere la valeur du like (like = 1 , dislike = -1 , rien = 0)
  let userId = req.body.userId;     // qui fait la notation
  let sauceId = req.params.id       // sur quelle sauce ( en parametre ds la requete)
  console.log(sauceId);
  //--------------------- cas like ( j'aime) -----------------------------------
  if(like === 1){
    console.log('like 1');
    // MAj : _id (sauce edité), maj tableau userId , maj du nb de like
    Sauce.updateOne({
      _id: sauceId
    }, {
      $push: {
        usersLiked: userId
      },
      $inc: {
        likes: +1
      },
    })
    .then(() => {res.status(200).json({message: 'add like'})})
    .catch((error) => {res.status(400).json({error: error})})
  }
  //------------------------ cas dislike ( je n'aime pas) -----------------------------------
  if(like === -1){
    Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId},$inc:{dislikes: +1},})
      .then(() => {res.status(200).json({message: 'add dislike'})})
      .catch((error) => {res.status(400).json({error: error})})
  }

  //-------------------------- cas annulation d'un like ou dislike -----------------------------
  if(like === 0){
    Sauce.findOne({_id: sauceId})  // recherche de la sauce a modifier
    .then((sauce) =>{
      // supression du dislike 
      if(sauce.usersDisliked.includes(userId)){   // test presence du userId dans la liste
        console.log('Supression userID Dislike');
        Sauce.updateOne({_id: sauceId}, {$pull: {usersDisliked: userId},$inc:{dislikes: -1},})
        .then(() => {res.status(200).json({message: 'neutral'})})
        .catch((error) => {res.status(400).json({error: error})})
      }
      // supression du like 
      if(sauce.usersLiked.includes(userId)){   // test presence du userId dans la liste
        console.log('Supression userID Like');
        Sauce.updateOne({_id: sauceId}, {$pull: {usersLiked: userId},$inc:{likes: -1},})
          .then(() => {res.status(200).json({message: 'neutral'})})
          .catch((error) => {res.status(400).json({error: error})})
      }
    })
    .catch((error) => {res.status(400).json({error: error})}) // sauce non trouvé
    
  }


}