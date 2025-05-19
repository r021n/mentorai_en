const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
});

router.get("/", exerciseController.getExcerciseTopics);
router.get("/:topicId", exerciseController.getExercisePage);
router.post("/:topicId/submitAnswer", exerciseController.postSubmitAnswer);

module.exports = router;
