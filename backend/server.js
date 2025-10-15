import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
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

//Register Route
app.post("/register", async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required"})
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users(username, password) VALUES (?,?)",
            [username, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({ message: "Username already exists" });
                      }
                      return res.status(500).json({ message: "Database error", error: err });
                    }            
                res.status(201).json({ message: "User registered successfully" });
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Error hashing password", error });
    }
});
  

//Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password){
        return res.status(400).json({ message: "Username and password required" });
    }

    db.query{
        
    }
}
)


//start server
app.listen(5050, () =>{
    console.log("Server started on port 5050")
});
