
const bcrypt = require('bcrypt');           // lib bcrypt pour cryptage password
const jwt = require('jsonwebtoken');        // lib jsonwebtoken pour gestion des token

const User = require('../models/user');     // model user



//----------------------- gestion des utilisateurs -------------------------------

//----------------------------------------------------------------------
// requete POST SIGNUP, Ajout d'un utilisateur dans la base de données
//------------------------------------------------------------------------
exports.signup = ((req, res, next) => {
    //delete req.body._id;  // supression de l'id créé par node
    bcrypt.hash(req.body.password, 10)  // 10 tours, semble suffisant pour un bon cryptage pas trop long
        .then(hash => {
            const newUser = new User({
                email: req.body.email,  // email saisie
                password: hash          // password crypté
            });
            // sauvegarde du user
            newUser.save()
                .then(() => res.status(201).json({ message: 'Utilisateur enregistré !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error=> res.status(500).json({error}));
});

//--------------------------------------------------------------------------------------------------
// requete POST LOGIN , verification d'un utilisateur dans la base de données,retourne l'id + token signé
//---------------------------------------------------------------------------------------------------
exports.login = async function (req, res, next) {

    // --------------- gestion de l'utilisateur ( login name) ------------------
    const user = await User.findOne ({ email: req.body.email}); // await : on attend la reponse
    if(!user){  // verif si l'utilisateur est trouvé
        return res.status(401).json({error: 'Utilisateur inconnue'});
    }
    // ---------------- verification du mot de passe -------------------------
    const passValid = await bcrypt.compare(req.body.password, user.password);
    if(!passValid){
        return res.status(401).json({error: 'Password incorrect'});
    }
    
    //--------------si identification ok, on renvoi l'id et le token ------------------
    res.status(200).json({
        userId: user._id,
        token: jwt.sign(            // création du token
            {userId: user._id},
            'chaine-secrete',       // chaine de cryptage ( 3eme partie)
            { expiresIn: '24h'}     // token valid 24h
        )               
    })
};