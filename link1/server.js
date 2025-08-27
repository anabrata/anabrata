const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const QRCode = require("qrcode");
const shortid = require("shortid");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./qrdata.db");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// DB Init
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS qrcodes (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT, short TEXT, url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Auth Middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

// Routes
app.get("/", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  db.all("SELECT * FROM qrcodes WHERE user_id=?", [req.session.userId], (err, rows) => {
    res.render("dashboard", { qrcodes: rows });
  });
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email=?", [email], (err, user) => {
    if (!user) return res.send("User not found");
    if (!bcrypt.compareSync(password, user.password)) return res.send("Invalid password");
    req.session.userId = user.id;
    res.redirect("/");
  });
});

app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (email,password) VALUES (?,?)", [email, hash], function (err) {
    if (err) return res.send("User already exists");
    req.session.userId = this.lastID;
    res.redirect("/");
  });
});

app.post("/generate", requireLogin, (req, res) => {
  const { url } = req.body;
  const short = shortid.generate();
  db.run("INSERT INTO qrcodes (user_id, short, url) VALUES (?,?,?)", [req.session.userId, short, url], function () {
    res.redirect("/");
  });
});

app.get("/edit/:id", requireLogin, (req, res) => {
  db.get("SELECT * FROM qrcodes WHERE id=?", [req.params.id], (err, row) => {
    res.render("edit", { qr: row });
  });
});

app.post("/edit/:id", requireLogin, (req, res) => {
  db.run("UPDATE qrcodes SET url=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", [req.body.url, req.params.id], () => {
    res.redirect("/");
  });
});

app.get("/delete/:id", requireLogin, (req, res) => {
  db.run("DELETE FROM qrcodes WHERE id=?", [req.params.id], () => {
    res.redirect("/");
  });
});

// Shortlink redirect
app.get("/r/:short", (req, res) => {
  db.get("SELECT * FROM qrcodes WHERE short=?", [req.params.short], (err, row) => {
    if (!row) return res.send("Invalid QR code");
    res.redirect(row.url);
  });
});

// Generate QR Image
app.get("/qr/:short", (req, res) => {
  const url = req.protocol + "://" + req.get("host") + "/r/" + req.params.short;
  QRCode.toDataURL(url, { width: 300 }, (err, qr) => {
    res.render("qr", { qr, url });
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Start server
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
