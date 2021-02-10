const path = require("path");
require("dotenv").config({path: '../.env'});
const mongoose = require("mongoose");

const databaseConnectivity = async()=>{
    const url = process.env.DATABASE_URL;  
    //const url = process.env.LOCAL_DB;
try{
    //basic database connectivity config
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        });

        const connection = mongoose.connection;

        //once is a trigger that gets the db open
        connection.once("open", ()=>{
        console.log("😀 Database is connected...");
        });
} catch(err) {
        console.log(err);
        console.log('😔 Connection failed');
    }
}

module.exports = databaseConnectivity;
