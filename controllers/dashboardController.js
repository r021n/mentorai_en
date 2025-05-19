exports.getDashboard = (req, res) => {
  const user = req.session.user;
  res.render("dashboard", { user });
};
