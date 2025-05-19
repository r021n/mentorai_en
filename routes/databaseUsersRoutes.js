const express = require("express");
const router = express.Router();
const databaseUsersController = require("../controllers/databaseUsersController");

// middleware untuk hanya mengizinkan admin yang boleh mengakses
router.use((req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    return res.redirect("/dashboard");
  }

  next();
});

router.get("/", databaseUsersController.getUsersPage);
router.get("/search", databaseUsersController.searchUsers);
router.post("/delete", databaseUsersController.deleteUsers);
router.post("/edit", databaseUsersController.editUsers);

module.exports = router;
