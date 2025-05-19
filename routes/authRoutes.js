const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// middleware pengecekan autentikasi
function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  next();
}

router.get("/login", redirectIfAuthenticated, authController.getLogin);
router.post("/login", redirectIfAuthenticated, authController.postLogin);

router.get("/register", redirectIfAuthenticated, authController.getRegister);
router.post("/register", redirectIfAuthenticated, authController.postRegister);

router.get("/logout", authController.logout);

// alihkan route root ke halaman login

module.exports = router;
