import express from "express"
import pool from "./db.js"
import cors from "cors"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK = "http://localhost:8080/api/v1/auth/github/callback";

app.get("/api/v1/auth/github", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 10 * 60 * 1000 });
  const url = new URL("https://github.com/login/oauth/authorize");
  url.search = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: CALLBACK,
    scope: "read:user user:email",
    state,
  });
  res.redirect(url.toString());
});

app.get("/api/v1/auth/github/callback", async (req, res) => {
  let connection;
  const secret_key = process.env.JWT_SECRET || 'Set environment variable for JWT_SECRET';
  
  if (secret_key == 'Set environment variable for JWT_SECRET') {
    console.log('Set environment variable for JWT_SECRET');
    res.status(500).json({ message: 'Invalid credentials in server environment' });
    return;
  }
  const fail = (msg) => res.redirect(`http://localhost:3000/auth/callback?error=${encodeURIComponent(msg)}`);
  try {
    const { code, state } = req.query;
    if (!code || !state || state !== req.cookies.oauth_state) return fail("Invalid state");
    res.clearCookie("oauth_state");

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK,
      }),
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) return fail("GitHub token exchange failed");

    const gh = { Authorization: `Bearer ${access_token}`, "User-Agent": "MeunierBoard" };

    // Email may be private; fetch the primary verified one
    const emails = await (await fetch("https://api.github.com/user/emails", { headers: gh })).json();
    const primary = emails.find((e) => e.primary && e.verified)?.email;
    if (!primary) return fail("No verified email on your GitHub account");

    connection = await pool.getConnection();
    let [user] = await connection.query('SELECT * FROM users WHERE email = ?', [primary]);
    if (user.length == 0) user = await connection.query("INSERT INTO users (email) VALUES (?)", [primary]);
    else if (!user[0].verified) await connection.query('UPDATE users SET verified = 1 WHERE id = ?', [user[0].id]);

    const token = jwt.sign({ id: user[0].id }, secret_key);
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  } catch (e) {
    console.error(e);
    fail("Sign-in failed");
  } finally {
    if (connection) connection.release();
  }
});

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

app.post("/api/v1/verify", async (req, res) => {
  let connection;
  const token = req.headers.authorization.split(' ')[1];
  const secret_key = process.env.JWT_SECRET || 'Set environment variable for JWT_SECRET';

  if (secret_key == 'Set environment variable for JWT_SECRET') {
    console.log('Set environment variable for JWT_SECRET');
    res.status(500).json({ message: 'Invalid credentials in server environment' });
    return;
  }

  try {
    connection = await pool.getConnection();
    const id = jwt.verify(token, secret_key).id;
    const [user] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
    if (user.length == 0) return res.status(400).json({ error: "Wrong token or user not found" });

    res.status(200).json({ message: "Token verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
