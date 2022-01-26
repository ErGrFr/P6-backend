
const schema = require('../models/password');

module.exports = (req,res,next) => {

    if (!schema.validate(req.body.password)){ // si password ok
        res.writeHead(400,'{"message":"mot de pass non conforme"}',{'content-type':' application/json'});
        res.end('password incorrect');
    } else {

        next();  // on passe a la suite
    }
};