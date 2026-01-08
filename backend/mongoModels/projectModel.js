import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: {
        type: Number, //userid from SQL to help identify who this project belongs to
        required: true,
    },
    title:{
        type: String,
        required: true,
        maxlength: 200,
    },
    description:{
        type: String,
        maxlength: 500,
    },
    cover:{
        type: Image,
    },
    content: {
        type: String,
        default: ""
    },
    createdAt: { type: Date, default: Date.now }
});

project = mongoose.model("Project", projectSchema);

export default project;