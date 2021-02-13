const fs = require("fs");
const model = require("./models/dbModel");
const database = require("./config/db");

const delItem = async()=>{
    database();
    const past24 = new Date(Date.now() - (1000*60*60*24));  //to obtain if the file exists more than 24hrs
    const items = await model.find({createdAt: {$lt: past24}}); //filtering via lt(less than) and stores the obtained array into the variable
    
    if(items.length){
        try {
            items.forEach(async(element) => {
                console.log(`${element.fileName} is going to be deleted`); 
                fs.unlinkSync(element.path);    //sequence wise by unlinkSync method
                await element.remove(); //eventually file gets removed if it is exist more than 24hrs
            });
        } catch (err) {
            console.log(`An error happend while deleting the item: ${err}`);
        }
        console.log("Deletion job is done");
    }
}

delItem().then(process.exit); //once delItem completes its work then it calls exit() to termination