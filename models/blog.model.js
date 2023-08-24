const { default: mongoose } = require("mongoose");

const commentSchema = mongoose.Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
}, { versionKey: false })

const blogSchema = mongoose.Schema({
    userID: { type: String, required: true },
    username: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    avatar: { type: String, required: true },

    likes: { type: Number, required: true },
    comments: [commentSchema]

}, { versionKey: false })

const Blog = mongoose.model("blog", blogSchema);
module.exports = { Blog }