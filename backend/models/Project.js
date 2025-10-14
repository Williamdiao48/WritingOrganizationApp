import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";

class Project extends Model {}

Project.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull:false,
    },
    description: DataTypes.STRING(300),
    content: {
        type: DataTypes.TEXT,
        defaultValue: "",
    },
}, {
    sequelize,
    modelName: "Project",
});

Project.belongsTo(User, { foreignKey: "user_id", as: "owner" });
User.hasMany(Project, { foreignKey: "user_id", as: "projects" });

export default Project;