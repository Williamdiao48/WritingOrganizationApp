import mongoose from "mongoose";

const worldSchema = new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'project',
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
    createdAt: { type: Date, default: Date.now }
}); 
//Add character ids to this model later to allow the model to store certain characters

const World = mongoose.model('World', worldSchema);

export default World;
