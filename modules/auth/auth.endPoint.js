const { roles } = require("../../middlwear/auth");


const endPoint = {
    logout: [roles.Admin, roles.HR, roles.User]
}


module.exports = {
    endPoint
}