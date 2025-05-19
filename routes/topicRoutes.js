const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");
const questionRoutes = require("./questionRoutes");

// middleware untuk mengizinkan hanya admin yang boleh akses
router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
});

// daftar topik
router.get("/", topicController.getTopics);

// tambah topik
router.get("/new", topicController.getAddTopic);
router.post("/new", topicController.postAddTopic);

// edit topik
router.get("/edit/:id", topicController.getEditTopic);
router.post("/edit/:id", topicController.postEditTopic);

// hapus topik
router.post("/delete/:id", topicController.postDeleteTopic);

// daftar questions
router.use("/list/:id_topic", questionRoutes);
module.exports = router;
