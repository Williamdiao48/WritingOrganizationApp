import { DataTypes, Model } from "sequelize";
import sequelize from "../../db.js";


class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    tableName: "Users",
    timestamps: true,
});

export default User;