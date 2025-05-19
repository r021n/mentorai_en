const express = require("express");
const router = express.Router({ mergeParams: true });
const questionController = require("../controllers/questionController");
const multer = require("multer");

// konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", questionController.getQuestions);
router.get("/create", questionController.getAddQuestion);
router.post(
  "/create",
  upload.single("image"),
  questionController.postAddQuestion
);
router.get("/edit/:id", questionController.getEditQuestion);
router.post(
  "/edit/:id",
  upload.single("image"),
  questionController.postEditQuestion
);
router.post("/delete/:id", questionController.deleteQuestion);

module.exports = router;
