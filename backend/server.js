import express from "express";
import cors from "cors";
import mysql from "mysql2";
import sequelize from "./db.js"; 
import "./models/User.js";
import "./models/Project.js";
import "./models/WordCount.js";

sequelize.sync({ alter: true}). then(() => {
    console.log("All models synced with MySQL")
});

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());


//Connect to MySQL database

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "",
    database: "writing_app"
})

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);}
        else{
            console.log("Connected to MySQL");
        }
});

//test route
app.get("/", (req, res) => {
    res.send("Backend server is running!");
  });
  

//start server
app.listen(5050, () =>{
    console.log("Server started on port 5050")
});

app.get("/test-db", (req, res) => {
    const sql = "SELECT * FROM test_table";

    db. query(sql, (err, results) => {
        if (err) {
            console.error("Database query failed:", err);
            res.status(500).json({ error: "Database query failed"});}
        else{
            res.json(results);
        }
    });
});