import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    name:{
        type: String,
        required:true,
        maxlength: 200
    },
    role:{
        type: String,
        maxlength: 200,
    },
    avatar:{
        type: String
    },
    basics:{
        age: String,
        gender: String,
        species: String,
    },
    traits:[{
        label: String,
        value: String
    }],
    backstory:{
        type: String,
        maxlength: 5000
    },
}, { timestamps: true });

const Character = mongoose.model("Character", characterSchema);

export default Character;