exports.getMyAnswers = (req, res) => {
  const topicId = req.params.topicId;
  const userId = req.session.user.id;
  const db = req.db;

  //   query untuk mengambil data answer beserta soal
  const sql = `SELECT a.*, q.question AS questionText FROM answers AS a
  JOIN questions AS q ON a.questionId = q.id
  WHERE a.topicId = ? AND a.userId = ?
  ORDER BY a.id ASC
  `;

  db.all(sql, [topicId, userId], (err, answers) => {
    if (err) {
      return res.send("An error occurred while retrieving answer data");
    }

    // query untuk menghitung total skor berdasarkan topicId dan userId
    db.get(
      "SELECT SUM(score) AS totalScore FROM answers WHERE topicId = ? AND userId = ?",
      [topicId, userId],
      (err2, totalRow) => {
        if (err2) {
          return res.send(
            "An error occurred while calculating the total score"
          );
        }

        // jika tidak ada jawaban, maka ubah total skor menjadi 0
        const totalScore = totalRow.totalScore ? totalRow.totalScore : 0;
        res.render("myAnswers/myAnswers", {
          answers: answers,
          totalScore: totalScore,
        });
      }
    );
  });
};
