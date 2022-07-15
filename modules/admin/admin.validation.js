const Joi = require("joi");


const deleteProfile = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}


const softDelete = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}

module.exports = {
    deleteProfile,
    softDelete
};