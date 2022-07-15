const Joi = require("joi");

const createProduct = {
    body: Joi.object().required().keys({
        title: Joi.string().min(2).required(),
        desc: Joi.string().min(2).required(),
        price: Joi.number().required()
    })
}

const updateProduct = {
    body: Joi.object().required().keys({
        title: Joi.string().min(10).required(),
        desc: Joi.string().min(10).required(),
        price: Joi.number().required(),
    }),
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const deleteProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const softDelete = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const likeProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const wishList = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}

const hideProduct = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}




const createComment = {
    body: Joi.object().required().keys({
        body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
    })
}


const replyOnComment = {
    body: Joi.object().required().keys({
        body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}


const updateComment = {
    body: Joi.object().required().keys({
        body: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}


const deleteComment = {
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}


const likeComment = {
    params: Joi.object().required().keys({
        productId: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    softDelete,
    wishList,
    hideProduct,
    createComment,
    likeProduct,
    replyOnComment,
    updateComment,
    deleteComment,
    likeComment
}