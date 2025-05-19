exports.getAllByTopic = (db, topicId, callback) => {
  const sql = "SELECT * FROM questions WHERE topicId = ?";
  db.all(sql, [topicId], callback);
};

exports.getById = (db, id, callback) => {
  const sql = "SELECT * FROM questions WHERE id = ?";
  db.all(sql, [id], callback);
};

exports.create = (db, data, callback) => {
  const sql =
    "INSERT INTO questions (question, pathImage, imageDescription, topicId) VALUES (?, ?, ?, ?)";
  db.run(
    sql,
    [data.question, data.pathImage, data.imageDescription, data.topicId],
    callback
  );
};

exports.update = (db, id, data, callback) => {
  const sql =
    "UPDATE questions SET question = ?, pathImage = ?, imageDescription = ? WHERE id = ?";
  db.run(
    sql,
    [data.question, data.pathImage, data.imageDescription, id],
    callback
  );
};

exports.delete = (db, id, callback) => {
  const sql = "DELETE FROM questions WHERE id = ?";
  db.run(sql, [id], callback);
};
