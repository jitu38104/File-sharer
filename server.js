require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./config/db");
const router = require("./routes/files");
const Display = require("./routes/show");
const download = require("./routes/download");

//open db
database();

//ejs template
app.set("view engine", "ejs");

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors middleware
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(",")
}
app.use(cors(corsOptions));

//routes
app.use("/api/files", router);
app.use("/files", Display);
app.use("/file/download", download);

//static filder middleware
app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.render("index");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Click on this link: http://localhost:${PORT}`);
});