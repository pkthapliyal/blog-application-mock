const express = require("express");

const { User } = require("../models/user.model");
const { Blog } = require("../models/blog.model");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { error } = require("console");

const blogRoute = express.Router();
const secretKey = "secret@123"


const auth = async (req, res, next) => {

    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(404).send({ error: "unauthorized" })
        }
        else {
            let decode = jwt.decode(token, secretKey)


            if (!decode) {
                return res.status(404).send({ error: "unauthorized" })
            }
            else {

                req.body.username = decode.username;
                req.body.userID = decode.userID;
                req.body.avatar = decode.avatar;
                next()
            }

        }

    } catch (err) {
        return res.status(404).send({ error: err.message })
    }
}


//  get route
blogRoute.get("/blogs", auth, async (req, res) => {
    try {
        const { title, category, sort, order } = req.query

        if (title) {
            let blogs = await Blog.find({ title: { $regex: title, $options: "i" } })
            return res.status(201).send({ data: blogs })
        }
        else if (category) {
            let blogs = await Blog.find({ category: category })
            return res.status(201).send({ data: blogs })
        }
        else if (order) {
            let sortValue = order == "asc" ? 1 : -1;
            let blogs = await Blog.find().sort({ date: sortValue })
            return res.status(201).send({ data: blogs })
        }

        let blogs = await Blog.find()
        return res.status(201).send({ data: blogs })

    } catch (err) {
        console.log(err.message)
        return res.status(404).send({ error: "something went wrong" })
    }
})




blogRoute.post("/blogs", async (req, res) => {
    try {
        let token = req.headers.authorization

        if (!token) {
            return res.status(404).send({ error: "unauthorized" })
        }

        let decode = jwt.decode(token, secretKey)
        console.log(decode)


        if (!decode) {
            return res.status(404).send({ error: "unauthorized" })
        }


        req.body.username = decode.username;
        req.body.userID = decode.userID;
        req.body.avatar = decode.avatar;
        console.log(req.body)

        const { title, username, userID, content, date, likes, category, avatar } = req.body;
        console.log(req.body)
        // let comments=[]

        let blog = new Blog({ ...req.body, comments: [], likes: 0 })

        await blog.save()
        return res.status(201).send({ message: "One blog has been posted !" })


    } catch (err) {
        console.log(err.message)
        return res.status(404).send({ error: "something went wrong" })
    }
})


blogRoute.patch("/blogs/:id", auth, async (req, res) => {
    try {
        const blogID = req.params.id
        await Blog.updateOne({ _id: blogID }, { ...req.body })
        return res.status(200).send({ message: "One blog has been updated !" })


    } catch (err) {
        console.log(err.message)
        return res.status(404).send({ error: "something went wrong" })
    }
})

blogRoute.delete("/blogs/:id", auth, async (req, res) => {
    try {
        const blogID = req.params.id
        await Blog.deleteOne({ _id: blogID })
        return res.status(200).send({ message: "One blog has been deleted !" })


    } catch (err) {
        console.log(err.message)
        return res.status(404).send({ error: "something went wrong" })
    }
})

//  adding likes  

const commentAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) {
            return res.status(404).send({ error: "unauthorized" })
        }
        else {
            let decode = jwt.decode(token, secretKey)

            if (!decode) {
                return res.status(404).send({ error: "unauthorized" })
            }
            else {
                req.body.username = decode.username;

                next()
            }

        }

    } catch (err) {
        return res.status(404).send({ error: "unauthorized" })
    }
}


//  add commnets
blogRoute.patch("/blogs/:id/comment", commentAuth, async (req, res) => {
    try {
        const blogID = req.params.id
        const { content, username } = req.body;
        let comment = { content, username }
        await Blog.updateOne({ _id: blogID }, { $push: { comments: comment } })
        return res.status(200).send({ message: "You have commented on the blog !" })


    } catch (err) {
        console.log(err.message)
        return res.status(404).send({ error: "something went wrong" })
    }
})

blogRoute.patch("/blogs/:id/like", commentAuth, async (req, res) => {
    try {
        const blogID = req.params.id
        const blogs = await Blog.findOne({ _id: blogID })



        blogs.likes++

        await Blog.updateOne({ _id: blogID }, { likes: blogs.likes })


        return res.status(200).send({ message: "You have liked on the blog !" })


    } catch (err) {
        console.log(err.message)
        return res.status(404).send({ error: "something went wrong" })
    }
})





module.exports = { blogRoute }