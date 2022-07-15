const { auth } = require("../../middlwear/auth");
const { endPoint } = require("./admin.endPoint");
const validation = require('../../middlwear/validation');
const validators = require('./admin.validation');
const adminController = require("./controller/admin")
const router = require("express").Router();



router.delete('/user/:id', validation(validators.deleteProfile), auth(endPoint.deleteProfile), adminController.deleteProfile);
router.patch('/user/:id', validation(validators.softDelete), auth(endPoint.softDelete), adminController.softDelete);
// router.get("/invoice", auth(endPoint.getAllUsers), adminController.invoice)










module.exports = router