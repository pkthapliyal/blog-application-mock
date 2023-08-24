const { default: mongoose } = require("mongoose");

require("dotenv").config();
const connection = mongoose.connect("mongodb+srv://pkthapliyal:pankajkr@cluster0.l1f5yob.mongodb.net/blog-application-mock?retryWrites=true&w=majority");

module.exports = { connection }