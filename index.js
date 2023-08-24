const express = require("express");
const port = 3030;
const cors = require("cors")
const app = express();
const { connection } = require("./config/db")


//  middleware
app.use(express.json())
app.use(cors());


//  routee
const { userRoute } = require('./routes/user.routes');
const { blogRoute } = require("./routes/blog.routes");

app.use('/api', userRoute)
app.use("/api", blogRoute)

app.listen(port, async () => {
    try {
        await connection;
        console.log("server is listening at.", port)
    } catch (err) {
        console.log({ error: err })

    }
})



