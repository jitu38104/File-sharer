require("dotenv").config({path: "../.env"});
const router = require("express").Router();
const model = require("../models/dbModel");

//leads us to download page
router.get("/:uuid", async (req, res)=>{
    const itemID = req.params.uuid; //uuid parameter
    try {
        const file = await model.findOne({uuid: itemID});
        if(file){
            console.log(file);  
            //some variables of this obj to be displayed in download page
            const itemObj = {
                uuid: file.uuid, 
                filename: file.fileName,
                size: (file.size/1048576)<1 ? `${parseInt(file.size/1024)} KB` : `${parseInt(file.size/1048576)} MB`,
                link: `${process.env.APP_URL}/file/download/${file.uuid}`
            }
            res.render("download", {item: itemObj, flag: 1});
        } else {
            res.render("download", {error: "File does not exist anymore", flag: 0});
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;