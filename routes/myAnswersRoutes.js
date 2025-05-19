const express = require("express");
const router = express.Router();
const myAnswersController = require("../controllers/myAnswersController");

// Pemeriksaan autentikasi
router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
});

// route
router.get("/:topicId", myAnswersController.getMyAnswers);

module.exports = router;
