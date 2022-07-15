const Joi = require("joi");

const signup = {

    body: Joi.object().required().keys({
        userName: Joi.string().required().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$*%{}?]{1,20}$/)),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        age: Joi.number().min(18).required(),
        gender: Joi.valid('Male', 'Female').required(),
        password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword: Joi.string().valid(Joi.ref('password')).required()
    })
}


const forgetPassword = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        code: Joi.number().required(),
        newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}


const sendCode = {
    body: Joi.object().required().keys({
        email: Joi.string().email().required()
    })
}


const login = {

    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    })
}


const confirmEmail = {
    params: Joi.object().required().keys({
        token: Joi.string().required(),
    })
}


const reConfirmationEmail = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    }),
}

module.exports = {
    signup,
    login,
    confirmEmail,
    reConfirmationEmail,
    forgetPassword,
    sendCode
}