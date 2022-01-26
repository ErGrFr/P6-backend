const passwordValidator = require('password-validator');

// Create a schema
const schema = new passwordValidator();

// proprietees
schema
.is().min(3)                                    // Minimum 3 caracts
.is().max(100)                                  // Maximum 20 caracts
.has().uppercase()                              // 1 majuscule
.has().lowercase()                              // 1 minuscule
.has().digits()                                 // 1 chiffre
.has().not().spaces()                           // pas d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist 

module.exports = schema;
