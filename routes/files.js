require("dotenv").config({path: "../.env"});
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const model = require("../models/dbModel");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../services/mailService");
const mailTemp = require("../services/template");

//////////multer is parsing the detail of file///////////
let storageData = multer.diskStorage({
    destination: (req, file, cb)=> cb(null, 'uploads/'), //folder name for storing there
    filename: (req, file, cb) => {  //creating file name with unique prefix
        const uniqName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqName);
    }
});

let upload = multer({
    storage: storageData,
    limits: {fileSize: 1000000 * 100}   //limiting the size for file to be uploaded
}).single("Myfile");    //name value of input:file tag
////////////////////////////////////////////////////////

router.post('/', (req, res)=>{  
    //store into uploads file
    upload(req, res, async(err)=>{
        //validate the file
        if(!req.file){
            return res.json({err: "File has not been found!"}); //sending json data without JSON.parse
        } else if(err){
            return res.status(500).send({err: err.message});
        }
        console.log(req.file);
        //store into database
            const file = new model({
                fileName: req.file.filename,
                uuid: uuidv4(), //uuid provides the random id
                path: req.file.path,
                size: req.file.size
            });
                    
            const Response = await file.save().catch(error => { throw error});
            
        //acknowledgment of the data
            const linkObj = {link: `${process.env.APP_URL}/files/${Response.uuid}`, uuid: Response.uuid}; //final link for the download page
            res.json({linkObj});
            console.log(linkObj);        
    });
});

router.post("/send", async(req, res)=>{
    console.log(req.body);
    const { uuid, emailFrom, emailTo } = req.body;  //object structuring
    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({err: "All feilds are required"});
    } else {
        const file = await model.findOne({uuid: uuid});
        if(file.sender){
                return res.status(422).send({err: "Email has already been sent"});
        } else {
                file.sender = emailFrom;
                file.receiver = emailTo;
                const size = (file.size/1048576)<1 ? `${parseInt(file.size/1024)} KB` : `${parseInt(file.size/1048576)} MB`; //gives the proper file size in KB or MB
                const link = process.env.APP_URL;
                //email portion
                sendMail({  //required from mailService.js
                    from: `JituBoss <${emailFrom}>`,
                    to: emailTo,
                    sub: "File-Sharer Link",
                    txt: "Download your file before 24 hrs",
                    html: mailTemp(emailFrom, size, uuid, link)   //calling a function of template.js 
                }).then(()=>{
                    file.save();  //now save the sender/receiver data into db
                    console.log("Emails' Id has been saved");
                    //res.json({msg: "data has been saved"}); /////more res.json, more errors regarding Headers
                }, error=>{
                    return res.json({callback: "E-mail ID is not correct!", flag: 0});
                    //res.status(422).send({err: error});
                });
        }            
        res.json({callback: "Email has been sent!", flag: 1});
    }
});

module.exports = router;