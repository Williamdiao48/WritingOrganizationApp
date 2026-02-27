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
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true, // nullable so existing rows aren't broken on ALTER
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    resetToken: {
        type: DataTypes.STRING(64), // SHA-256 hex hash of the raw token
        allowNull: true,
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
});

export default User;