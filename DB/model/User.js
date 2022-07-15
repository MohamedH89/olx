const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female'], default: "Male" },
    profilePic: String,
    coverPic: Array,
    confirmEmail: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    isBlooked: { type: String, required: false },
    role: { type: String, default: 'User' },
    pdfLink: String,
    code: String,
    socketID: String
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.saltRound))
    next()
})

userSchema.pre('findOneAndUpdate', async function (next) {

    console.log({ model: this.model });
    console.log({ query: this.getQuery() });
    const hookData = await this.model.findOne(this.getQuery()).select("__v")
    console.log({ hookData });
    this.set({ __v: hookData.__v + 1 })
    next()
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel