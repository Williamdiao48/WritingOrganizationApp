import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull:false,
    },
    password: {
        type:DataTypes.STRING(150),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "User",
    timestamps: true,
});

export default User;