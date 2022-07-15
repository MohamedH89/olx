require('dotenv').config()
const express = require("express");
const connectDB = require('./DB/connection');
const app = express();
var cors = require('cors')
const schedule = require('node-schedule');
const port = process.env.PORT
const indexRouter = require("./modules/index.router")
const path = require('path');


app.use(cors())
app.use(express.json())
// const path = require('path')
app.use('/api/v1/uploads', express.static(path.join(__dirname, './uploads')))
app.use('/api/v1/auth', indexRouter.authRouter)
app.use('/api/v1/user', indexRouter.userRouter)
app.use('/api/v1/product', indexRouter.productRouter)
app.use('/api/v1/admin', indexRouter.adminRouter)


const { createInvoice,today } = require('./services/createInvoice');
const moment = require('moment')
const sendEmail = require('./services/email');
const { initIo } = require('./services/socket');
const userModel = require('./DB/model/User');
const productModel = require('./DB/model/Product');

app.get('/', async (req, res) => {
  const products = await productModel.find({}).populate([
      { path: 'comments' }
  ])
  res.json({ message: 'done', products })
})

const job = schedule.scheduleJob('59 59 23 * * *', async function () {
  const products = await productModel.find({
    createdAt: { $gte: moment().startOf('day'), $lte: moment().endOf('day') }
  });
  const invoiceData = {
    shipping: {
      name: "Mohamed Darwish",
      address: "Damietta",
      city: "Damietta",
      state: "Damietta",
      country: "Egypt",
      postal_code: 11055
    },
    items: products,
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
  };
  createInvoice(invoiceData, path.join(__dirname, './uploads/PDF/products.pdf'));

  let message = `Products of the day      ${today}`;
  sendEmail('mohamed.elsayed62022@gmail.com', message, [
    {
      path: path.join(__dirname, './uploads/PDF/products.pdf'),
      filename: 'products.pdf'
    },
  ])
});



connectDB()
// app.listen(port, () => {
//     console.log(`server is running on port :::: ${port}`);
// })

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
const io = initIo(server);

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('updateSocketID', async (data) => {
    await userModel.findByIdAndUpdate(data, { socketID: socket.id })
  })
})