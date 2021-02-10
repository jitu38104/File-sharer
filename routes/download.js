const router = require("express").Router();
const model = require("../models/dbModel");

//direct download to link to fetch file from browser to lacal disk
router.get("/:uuid", async(req, res)=>{
    const itemID = req.params.uuid;
    await model.findOne({uuid: itemID}, (err, itemFound)=>{   
        if(err){
            console.log(err);            
        } else {
            const path = `${__dirname}/../${itemFound.path}`; //creting the absolute path for the file
            //console.log(path);
            res.download(path); //process to download via a created path
        }
    });
})

module.exports = router;