require("dotenv").config({path: "../.env"});
const nodemailer = require("nodemailer");

//authentication via api key or account ID and password
const sendMail = async({ from, to, sub, txt, html })=>{
    const transport = await nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        //service: "gmail",
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS
        }
    });

    //basic email options
    const options = {
        from: from,
        to: to,
        subject: sub,
        text: txt,
        html: html
    }
    
    //sending mail with proper response or error
    await transport.sendMail(options, (err, info)=>{
        if(!err){
            transport.close();  //email transport closed
            console.log("Email has been sent!");
            console.log(info.response);           
        } else {
            console.log("Ooops, there are some issues");
            console.log(err);
        }
    });
}

module.exports = sendMail;