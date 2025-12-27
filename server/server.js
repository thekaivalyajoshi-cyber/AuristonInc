import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "SUPER_SECRET_KEY"; // replace with env variable in production

// Dummy users for demo
const users = [
  { username: "investor", password: "investor123", role: "investor" },
  { username: "research", password: "research123", role: "research" },
  { username: "enterprise", password: "enterprise123", role: "enterprise" },
  { username: "admin", password: "admin123", role: "admin" }
];

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "2h" });
  res.json({ token, role: user.role });
});

// Protected endpoint example
app.get("/api/dashboard", (req, res) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Dashboard data for role: " + decoded.role });
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
