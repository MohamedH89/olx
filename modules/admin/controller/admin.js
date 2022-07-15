const userModel = require("../../../DB/model/User");
const productModel = require("../../../DB/model/Product");
// const { createInvoice } = require("../../../services/createInvoice");
const sendEmail = require("../../../services/email");
const path = require('path')
const moment = require('moment')


const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.deleteOne({ _id: id });
        if (user.deletedCount) {
            res.status(200).json({ message: 'Done' });
        }
        else {
            res.status(400).json({ message: 'in-valid account id' });
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}


const softDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            res.status(400).json({ message: 'in-valid account id' });
        }
        else {
            if (!user.isDeleted) {
                await userModel.findOneAndUpdate({ _id: user._id }, { isDeleted: true });
                res.status(200).json({ message: 'account is teprary deleted' });
            } else {
                await userModel.findOneAndUpdate({ _id: user._id }, { isDeleted: false });
                res.status(200).json({ message: 'account is un deleted' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'catch error', error });
    }
}


// const invoice = async (req, res) => {
//     // const users = await userModel.find({}).select('userName email age gender phone')
//     const products = await productModel.find({
//         createdAt: { $gte: moment().startOf('day'), $lte: moment().endOf('day') }
//     });
//     const invoiceData = {
//         shipping: {
//             name: "John Doe",
//             address: "1234 Main Street",
//             city: "San Francisco",
//             state: "CA",
//             country: "US",
//             postal_code: 94111
//         },
//         items: products,
//         subtotal: 8000,
//         paid: 0,
//         invoice_nr: 1234
//     };
//     createInvoice(invoiceData, path.join(__dirname, '../../../uploads/PDF/products.pdf'))
//     res.json({ message: "Done", link: req.protocol + '://' + req.headers.host + '/api/v1/admin/uploads/pdf/products.pdf' })
// }

module.exports = {
    deleteProfile,
    softDelete,
}