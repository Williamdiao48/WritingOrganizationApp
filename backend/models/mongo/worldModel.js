import mongoose from "mongoose";

const worldSchema = new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    name:{
        type:String,
        required: true,
        maxlength: 300
    },
    description:{
        type:String,
        maxlength: 3000
    },
    loreSections: [{
        header: String,
        body: String
    }],
}, { timestamps: true });
//Add character ids to this model later to allow the model to store certain characters

const World = mongoose.model('World', worldSchema);

export default World;
