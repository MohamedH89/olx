const router = require("express").Router();
const { auth } = require("../../middlwear/auth");
const validation = require("../../middlwear/validation");
const { myMulter, multerValidators, multerPath, HME } = require("../../services/multer");
const profileController = require("./controller/profile");
const endPoint = require("./user.endPoint");
const validators = require("./user.validation")


router.patch('/profile/password',
    auth(endPoint.updatePassword),
    validation(validators.updatePassword),
    profileController.updatePassword);


router.patch('/profile/email',
    auth(endPoint.updateEmail),
    validation(validators.updateEmail),
    profileController.updateEmail);

router.delete('/profile',
    auth(endPoint.deleteProfile),
    profileController.deleteProfile);


router.patch('/profile/pic',
    auth(endPoint.profilePic),
    myMulter(multerPath.profilePic, multerValidators.image).array('image', 5), HME,
    profileController.profilePic);


router.patch('/profile/cover',
    auth(endPoint.coverPic),
    myMulter(multerPath.coverPic, multerValidators.image).array('image', 5), HME,
    profileController.coverPIC);


router.get('/', profileController.getAllUsers);


module.exports = router 