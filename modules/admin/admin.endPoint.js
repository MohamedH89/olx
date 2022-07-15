const { roles } = require("../../middlwear/auth");


const endPoint = {
    deleteProfile: [roles.Admin],
    softDelete: [roles.Admin],
    invoice: [roles.Admin]
}

module.exports = {
    endPoint
}