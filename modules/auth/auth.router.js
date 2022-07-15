const router = require("express").Router();
const { auth } = require("../../middlwear/auth");
const validation = require("../../middlwear/validation");
const { endPoint } = require("./auth.endPoint");
const validators = require("./auth.validation")
const registrationController = require("./controller/registration")


//signup
router.post("/signup",
    validation(validators.signup),
    registrationController.signup)

//refresh email
router.get("/refreshEmail/:id",
    registrationController.refreshEmail)

//confirm email 
router.get("/confirmEmail/:token",
    validation(validators.confirmEmail),
    registrationController.confirmEmail)

//signin
router.post("/login",
    validation(validators.login),
    registrationController.login)

//signout
router.patch("/logout",
    auth(endPoint.logout),
    registrationController.logOut)

//send forget code
router.post("/sendCode",
    validation(validators.sendCode),
    registrationController.sendCode)


router.post("/forgetPassword",
    validation(validators.forgetPassword),
    registrationController.forgetPassword)







module.exports = router 