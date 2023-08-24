const express = require("express");
const { User } = require("../models/user.model");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRoute = express.Router();
const secretKey = process.env.secretKey


userRoute.post("/register", async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            return res.status(200).send({ message: "user already registered " })
        }

        bcrypt.hash(password, 3, async (err, hash) => {
            if (err) {
                return res.status(404).send({ error: "Something went wrong !" })
            }
            let user = new User({ username, email, password: hash, avatar });
            await user.save();
            return res.status(201).send({ message: "User registered!" })
        })


    } catch (error) {
        console.log(error.message)
        return res.status(404).send({ error: "Something went wrong !" })

    }
})


//  login

userRoute.post("/login", async (req, res) => {
    try {
        // name: { type: String, required: true },
        // email: { type: String, required: true },
        // password: { type: String, required: true }
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        console.log(user)


        if (!user) {
            return res.status(200).send({ message: "login failed" })
        }

        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(200).send({ message: "login failed" })
            }
            else if (result) {
                let userID = user._id

                let token = jwt.sign({ username: user.username, email: user.email, userID: user._id, avatar: user.avatar }, secretKey)
                return res.status(200).send({ message: "login sucessfull", token: token, userID: userID })
            }

        })


    } catch (error) {
        console.log(error.message)
        return res.status(404).send({ error: "Something went wrong !" })

    }
})



module.exports = { userRoute }