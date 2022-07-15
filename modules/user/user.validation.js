const Joi = require("joi");


const updatePassword = {
    body: Joi.object().required().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}


const updateEmail = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
    })
}



module.exports = {
    updatePassword,
    updateEmail
}