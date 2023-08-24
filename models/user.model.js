const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true }

}, { versionKey: false })

const User = mongoose.model("user", userSchema);
module.exports = { User }