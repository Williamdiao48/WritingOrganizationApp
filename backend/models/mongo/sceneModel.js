import mongoose from "mongoose";

const sceneSchema = new mongoose.model({
    chapterId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true,
        index: true
    },
    title: {
        type: String,
        default: "New Scene"
    },
    content: {
        type: String,
        default: ""
    },
    order: {
        type: Number,
        default: 0
    },
    //potentially link characters to strings as well
    /*characterIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character'
    }]*/
    },{timestamps: True});

    const Scene = mongoose.model("Scene", sceneSchema);
    
    export default Scene;