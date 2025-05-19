exports.getTopics = (db, callback) => {
  const sql = "SELECT * FROM topics";
  db.all(sql, [], callback);
};

exports.getTopicById = (db, id, callback) => {
  const sql = "SELECT * FROM topics WHERE id = ?";
  db.get(sql, [id], callback);
};

exports.insertTopic = (db, name, callback) => {
  const sql = "INSERT INTO topics (name) VALUES (?)";
  db.run(sql, [name], callback);
};

exports.updateTopic = (db, id, name, callback) => {
  const sql = "UPDATE topics SET name = ? WHERE id = ?";
  db.run(sql, [name, id], callback);
};

exports.deleteTopic = (db, id, callback) => {
  const sql = "DELETE FROM topics WHERE id = ?";
  db.run(sql, [id], callback);
};
