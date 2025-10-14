import { DataTypes, Model } from "sequelize"
import sequelize from "../db.js";
import Project from "./Project.js";

class WordCount extends Model {}

WordCount.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
    },
    date: {
        type:DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    words_written: {
        type:DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: "WordCount",
});

WordCount.belongsTo(Project, {foreignKey: "project_id"});
Project.hasMany(WordCount, { foreignKey: "project_id", as: "word_counts" });

export default WordCount;