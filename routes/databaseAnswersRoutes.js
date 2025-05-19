// routes/databaseAnswersRoutes.js
const express = require("express");
const router = express.Router();
const dbAnswersController = require("../controllers/databaseAnswersController");

router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    return res.redirect("/dashboard");
  }

  next();
});

// Rute untuk menampilkan halaman utama
router.get("/", dbAnswersController.getAnswersPage);

// Endpoint pencarian asinkron
router.get("/search", dbAnswersController.searchAnswers);

// Endpoint untuk menghapus data answers
router.post("/delete", dbAnswersController.deleteAnswers);

// Endpoint untuk mengedit data answers
router.post("/edit", dbAnswersController.editAnswers);

module.exports = router;
