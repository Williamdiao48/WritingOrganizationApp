import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    projectId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index:true,
    },
    worldId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'World'
    },
    title: {
        type: String,
        required: true,
        maxlength: 250
    },
    cover:{
        type: String,
    },
    summary:{
        type: String,
        maxlength: 2500
    },
    chapterIds: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }],
    sceneIds: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Scene'
    }],
    characterIds: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Character'
    }],
    status: {
        type: String,
        enum:['Draft', 'In Progress', 'Completed'],
        default: 'Draft'
    },
    visibility: {
        type: String,
        enum: ['Private', 'Public', 'Archived'],
        default: 'Private'
    },
}, { timestamps: true });

const Story = mongoose.model("Story", storySchema);

export default Story;