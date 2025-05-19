const authModel = require("../models/authModel");

exports.getLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  const db = req.db;
  authModel.getUserByUsername(db, username, (err, user) => {
    if (err) {
      return res.render("login", {
        error: "An error occurred, please try again",
      });
    }

    // validate user
    if (!user || user.password != password) {
      return res.render("login", {
        error: "Incorrect username or password",
      });
    }

    // store user data in session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    res.redirect("/dashboard");
  });
};

exports.getRegister = (req, res) => {
  res.render("register", { error: null });
};

exports.postRegister = (req, res) => {
  const { username, password, confirmPassword } = req.body;

  // form validation
  if (!username || !password || !confirmPassword) {
    return res.render("register", { error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.render("register", {
      error: "Password and confirmation password do not match",
    });
  }

  const db = req.db;

  // insert new user with role "siswa" (student)
  authModel.insertUser(db, username, password, "student", (err) => {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.render("register", { error: "Username is already in use" });
      }
      return res.render("register", {
        error: "An error occurred, please try again",
      });
    }

    res.redirect("/login");
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/dashboard");
};
