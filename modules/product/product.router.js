const { auth } = require("../../middlwear/auth");
const { endPoint } = require("./product.endpoint");
const productController = require("./controller/product");
const commentController = require("./controller/comment")
const validation = require("../../middlwear/validation");
const validators = require("./product.validation")
const router = require("express").Router();



router.post('/',
    auth(endPoint.createProduct),
    validation(validators.createProduct),
    productController.createProduct);


router.put('/:id',
    auth(endPoint.updateProduct),
    validation(validators.updateProduct),
    productController.updateProduct);


router.delete('/:id',
    auth(endPoint.deleteProduct),
    validation(validators.deleteProduct),
    productController.deleteProduct);


router.patch('/softDelete/:id',
    auth(endPoint.softDelete),
    validation(validators.softDelete),
    productController.softDelete);


router.patch('/like/:id',
    auth(endPoint.likeProduct),
    validation(validators.likeProduct),
    productController.likeProduct);


router.patch('/wishList/:id',
    auth(endPoint.wishList),
    validation(validators.wishList),
    productController.wishList);


router.patch('/hide/:id',
    auth(endPoint.hideProduct),
    validation(validators.hideProduct),
    productController.hideProduct);

//_____________________________________________________________


router.post('/:productId',
    auth(endPoint.createComment),
    validation(validators.createComment),
    commentController.createComment);


router.post('/:productId/:commentId/reply',
    auth(endPoint.replyOnComment),
    validation(validators.replyOnComment),
    commentController.replyOnComment);


router.patch('/:productId/:commentId',
    auth(endPoint.updateComment),
    validation(validators.updateComment),
    commentController.updateComment);


router.delete('/:productId/:commentId',
    auth(endPoint.deleteComment),
    validation(validators.deleteComment),
    commentController.deleteComment);


router.patch('/:productId/:commentId/like',
    auth(endPoint.likeComment),
    validation(validators.likeComment),
    commentController.likeComment);






module.exports = router