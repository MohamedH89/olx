const authRouter = require("./auth/auth.router");
const userRouter = require("./user/user.router");
const productRouter = require("./product/product.router");
const adminRouter = require("./admin/admin.router")





module.exports = {
    authRouter,
    userRouter,
    productRouter,
    adminRouter
}