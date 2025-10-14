import { Sequelize } from "sequelize";

const sequelize = new Sequelize ("writing_app", "root", "", {
    host: "localhost", 
    dialect: "mysql",
    logging: false
});

export default sequelize;