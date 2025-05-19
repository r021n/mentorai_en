exports.getUserByUsername = (db, username, callback) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], callback);
};

exports.insertUser = (db, username, password, role, callback) => {
  const sql = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  db.run(sql, [username, password, role], callback);
};
