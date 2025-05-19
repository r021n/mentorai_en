const express = require("express");
const router = express.Router();
const adminDownloadController = require("../controllers/adminDownloadController");

// middleware untuk hanya mengijinkan admin yang boleh mengakses
router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    return res.redirect("/dashboard");
  }

  next();
});

router.get("/:topicId", adminDownloadController.downloadTopicExcel);

module.exports = router;
