const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3001;

// koneksi ke database sqlite
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to sqlite database");
  }
});

// middleware untuk parsing form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// konfigurasi session
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// set EJS sebagai view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// folder untuk file static (css, js, image)
app.use(express.static(path.join(__dirname, "public")));

// membuat objek db supaya dapat diakses direquest (req.db)
app.use((req, res, next) => {
  req.db = db;
  next();
});

// import routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const topicRoutes = require("./routes/topicRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const myAnswersRoutes = require("./routes/myAnswersRoutes");
const studentsAnswersRoutes = require("./routes/studentsAnswersRoutes");
const adminDownloadRoutes = require("./routes/adminDownloadRoutes");
const faqRoutes = require("./routes/faqRoutes");
const databaseUsersRoutes = require("./routes/databaseUsersRoutes");
const databaseAnswersRoutes = require("./routes/databaseAnswersRoutes");

// menggunakan routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/topics", topicRoutes);
app.use("/exercise", exerciseRoutes);
app.use("/myAnswers", myAnswersRoutes);
app.use("/studentsAnswers", studentsAnswersRoutes);
app.use("/admin/download", adminDownloadRoutes);
app.use("/faq", faqRoutes);

// route untuk manajemen data pada database
app.use("/database/users", databaseUsersRoutes);
app.use("/database/answers", databaseAnswersRoutes);

// endpoint untuk halaman akhir exercise
app.get("/endExercise", (req, res) => {
  res.render("endExercise");
});

// endpoint untuk menampilkan halaman tidak ditemukan
app.get("/404", (req, res) => {
  res.status(404).render("404");
});

// middleware catch all route (langsung merender view 404)
app.use((req, res, next) => {
  res.status(404).render("404");
});

// buat tabel user jika belum ada dan seed akun admin
db.serialize(() => {
  // table users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT NOT NULL
    )`);

  // table topics
  db.run(`CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    )`);

  // table questions
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    pathImage VARCHAR(255),
    imageDescription TEXT,
    topicId INTEGER,
    FOREIGN KEY (topicId) REFERENCES topics(id)
    )`);

  // table answers
  db.run(`CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    answer TEXT,
    feedback TEXT,
    score INTEGER,
    userId INTEGER,
    questionId INTEGER,
    topicId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (questionId) REFERENCES questions(id),
    FOREIGN KEY (topicId) REFERENCES topics(id)
    )`);

  // cek dan sisipkan akun admin jika belum ada
  db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (!row) {
      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", "123", "admin"],
        (err) => {
          if (err) {
            console.error(err.message);
          }
          console.log("inserted admin account");
        }
      );
    }
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
