const express = require("express");
const router = express.Router();
const studentsAnswersController = require("../controllers/studentsAnswersController");

// middleware untuk memastikan hanya admin yang dapat mengakses route ini
router.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    res.redirect("/dashboard");
  }
  next();
});

// route
router.get("/:topicId", studentsAnswersController.getStudentsAnswers);

module.exports = router;
