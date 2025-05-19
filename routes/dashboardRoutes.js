const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// middleware pengecekan autentikasi
// router.use((req, res, next) => {
//   if (!req.session.user) {
//     return res.redirect("/login");
//   }
//   next();
// });

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/dashboard", dashboardController.getDashboard);

module.exports = router;
