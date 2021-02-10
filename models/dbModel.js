const mongoose = require("mongoose");
 
//creating schema for new document
const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: false
    },
    receiver: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

//converting that into model
const fileModel = mongoose.model("File", fileSchema);

module.exports = fileModel;