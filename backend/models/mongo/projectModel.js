import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    userId: {
        type: String, //userid from SQL to help identify who this project belongs to
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
        type: String,
    },
    worldIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'World'
    }],
    storyIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }],
    characterIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character'
    }],
    archived: {
        type: Boolean,
        default: false,
    },
    archivedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;