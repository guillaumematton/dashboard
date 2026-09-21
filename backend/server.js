import express from "express"
import pool from "./db.js"
import cors from "cors"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const app = express();

cors();

app.use(express.json());

app.post("/api/v1/register", async (req, res) => {
  let connection;
  const { email, password } = req.body;

  try {
    connection = await pool.getConnection();
    const [user] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length > 0) return res.status(400).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    await connection.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hash]);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

app.post("/api/v1/login", async (req, res) => {
  let connection;
  const { email, password } = req.body;
  const secret_key = process.env.JWT_SECRET || 'Set environment variable for JWT_SECRET';
  
  if (secret_key == 'Set environment variable for JWT_SECRET') {
    console.log('Set environment variable for JWT_SECRET');
    res.status(500).json({ message: 'Invalid credentials in server environment' });
    return;
  }

  try {
    connection = await pool.getConnection();
    const [user] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length == 0) return res.status(400).json({ error: "Wrong email or password" });

    const hash = user[0].password;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) return res.status(400).json({ error: "Wrong email or password" });

    const token = jwt.sign(user[0].id, secret_key);
    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
