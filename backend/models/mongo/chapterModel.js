import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    storyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Story',
        required:true,
        index:true
    },
    title:{
        type:String,
        maxlength:300,
        required:true,
        default: 'Untitled Chapter'
    },
    summary:{
        type:String,
        maxlength: 2000
    },
    content:{
        type:String,
        default:""
    },
    order: {
        type: Number,
        default: 0
    },
    sceneIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scene'
    }],
}, { timestamps: true});

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;