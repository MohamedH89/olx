const userModel = require("../../../DB/model/User")
const sendEmail = require("../../../services/email")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, gender } = req.body
        const newUser = new userModel({ firstName, lastName, email, password, phone, gender })
        const savedUser = await newUser.save()
        const token = jwt.sign({ id: savedUser._id }, process.env.emailToken, { expiresIn: 5 * 60 })
        const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
        const link2 = `${req.protocol}://${req.headers.host}/api/v1/auth/refreshEmail/${savedUser._id}`
        const message = `<a href='${link}'>plz follow me to confirm your account</a>
        <br>
        <a href='${link2}'>re-send confirmationEmail </a>
        `
        sendEmail(savedUser.email, message)
        res.status(201).json({ message: "Done" })
    } catch (error) {
        if (error.keyValue?.email) {
            res.status(409).json({ message: "email exist" })
        } else {
            res.status(500).json({ message: "catch error", error })
        }
    }
}

const refreshEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id).select("confirmEmail email")
        if (!user) {
            res.status(404).json({ message: "in-valid account" })
        } else {
            if (user.confirmEmail) {
                res.status(400).json({ message: "already confirmed" })
            } else {
                const token = jwt.sign({ id: user._id }, process.env.emailToken, { expiresIn: 2 * 60 })
                const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
                const link2 = `${req.protocol}://${req.headers.host}/api/v1/auth/refreshEmail/${user._id}`
                const message = `<a href='${link}'>plz follow me to confirm your account</a>
                <br>
                <a href='${link2}'>re-send confirmationEmail </a>
                `
                sendEmail(user.email, message)
                res.status(200).json({ message: "Done check u email" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        const decoded = jwt.verify(token, process.env.emailToken)
        if (!decoded) {
            res.status(400).json({ message: "In-valid token" })
        } else {
            console.log(decoded);
            const user = await userModel.findById(decoded.id).select('confirmEmail')
            if (!user) {
                res.status(404).json({ message: "In-valid token id" })
            } else {
                console.log(user);
                if (user.confirmEmail) {
                    res.status(400).json({ message: "u already confirmed plz procced to login pages" })
                } else {
                    const users = await userModel.findOneAndUpdate({ _id: user._id }, { confirmEmail: true }, { new: true })
                    res.status(200).json({ message: "Done plz login" })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "in-valid account email " })
    } else {
        if (!user.confirmEmail) {
            res.status(400).json({ message: "plz confirm your email first " })
        } else {
            if (user.isBlooked) {
                res.status(400).json({ message: "sorry this account is blooked " })
            } else {
                const match = await bcrypt.compare(password, user.password)
                if (!match) {
                    res.status(400).json({ message: "email password misMatch " })
                } else {
                    const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.loginToken, { expiresIn: '24h' })
                    await userModel.findOneAndUpdate({ id: user._id }, { online: true })
                    res.status(200).json({ message: "login success", token })
                }
            }
        }
    }
}


const logOut = async (req, res) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { online: false, lastSeen: Date.now() });
    res.json({ message: "Done", user })
}

const sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "in-valid email" })
        } else {
            const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000) //4589
            await userModel.findByIdAndUpdate(user._id, { code })
            sendEmail(user.email, `<p>use this code to update u password : ${code}</p>`)
            res.status(200).json({ message: "Done", code })
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}


const forgetPassword = async (req, res) => {
    try {
        const { code, email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "in-valid email" })
        } else {
            if (user.code != code) {
                res.status(400).json({ message: "in-valid auth code" })
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
                await userModel.findOneAndUpdate({ _id: user._id }, { password: hashedPassword, code: "" })
                res.status(200).json({ message: "Done" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch error", error })
    }
}


module.exports = {
    signup,
    confirmEmail,
    login,
    logOut,
    refreshEmail,
    sendCode,
    forgetPassword
}