const left = document.querySelector(".left");
const middle = document.querySelector(".middle");
const right = document.querySelector(".right");
const dropZone = document.querySelector(".dropzone");
const imgBorder = document.querySelector(".img-container");
const fileInpt = document.querySelector("#fileInpt");
const browseBtn = document.querySelector(".browseBtn");
const progressDiv = document.querySelector(".progressDiv");
const progressBar = document.querySelector(".progressBar");
const uploadingRate = document.querySelector("#rating");
const mailContainer = document.querySelector(".mail-container");
const copyBar = document.getElementById("fileLink");
const hiddenInp = document.querySelector(".hiddenInp");
const copyBtn = document.querySelector(".copyBtn");
const sendBtn = document.querySelector(".sendBtn");

let temp;

const addClass = ()=>{
        left.classList.add("selected-1");
        middle.classList.add("selected-2");
        right.classList.add("selected-3");
        imgBorder.classList.add("img-border");
}

const removeClass = ()=>{
    left.classList.remove("selected-1");
    middle.classList.remove("selected-2");
    right.classList.remove("selected-3");
    imgBorder.classList.remove("img-border");
}

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    addClass();
});

dropZone.addEventListener("dragleave", (e)=>{
    e.preventDefault();
    removeClass();
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    if(files.length){
        fileInpt.files = files;
        uploadFile();
    }
    removeClass();
    console.log(files);
});

browseBtn.addEventListener("click", (e)=>{
    fileInpt.click();
});
fileInpt.addEventListener("change", (e)=>{
    uploadFile();
});

sendBtn.addEventListener("click", (e)=>{
    emailOptions();
});

//xhr post uploading file...
const uploadFile = ()=>{
    const url = "http://localhost:3000/api/files";
    const method = "POST";

    const file = fileInpt.files[0];
    const formData = new FormData();
    formData.append("Myfile", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = updateProgress;

    xhr.open(method, url);

    xhr.onload = (e)=>{
        if(xhr.status >= 400){
            console.log("failed");
        } else {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    }
    xhr.onerror = (e)=>{
        console.log(e);
        console.log("Error!");
    }
    xhr.send(formData);
}

//for email details post
const emailOptions = ()=>{
    const url = "http://localhost:3000/api/files/send";
    const method = "POST";
    const emailObj = {
        uuid: document.querySelector(".hiddenInp").value,
        emailFrom: document.querySelector(".sender-box").value,
        emailTo: document.querySelector(".reciver-box").value
    }
    console.log(emailObj);
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = ()=>{
        if(xhr.status >= 400){
            console.log("failed");
        } else {
            successMsg(JSON.parse(xhr.response));
        }
    }
    xhr.onerror = ()=>{
        console.log("Error!");
    }
    xhr.send(JSON.stringify(emailObj));
}

const updateProgress = (e)=>{
    let percent = Math.round((e.loaded/e.total) * 100);

    if(!progressDiv.classList.contains("display-on")){
        progressDiv.classList.add("display-on"); 
    }
    uploadingRate.innerText = `${percent}%`;
    progressBar.style.width = `${percent}%`;
    if(percent === 100){
        progressDiv.classList.remove("display-on");
        mailContainer.classList.add("mail-displayOn");
        mailContainer.style.animationName = "mailBox";
        mailContainer.style.animationDuration = "500ms";
    }
}

const showLink = ({linkObj})=>{
    console.log(linkObj);
    copyBar.value = `${linkObj.link}`;
    hiddenInp.value = `${linkObj.uuid}`;
}

//success msg
const successMsg = ({ callback, flag })=>{
    const para = document.querySelector(".msg");
    para.innerText = `${callback}`;
    
    if(flag){
        para.classList.add("addFun");
    } else {
        para.style.animationName = "Notmessage";
        para.classList.add("addFun");
    }
    setTimeout(()=>{
        para.classList.remove("addFun");
    }, 7000);
}

//copy btn
copyBtn.addEventListener("click", (e)=>{
    copyBar.select();
    copyBar.setSelectionRange(0, 99999)
    document.execCommand("copy");
});

