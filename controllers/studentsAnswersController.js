exports.getStudentsAnswers = (req, res) => {
  const topicId = req.params.topicId;
  const db = req.db;

  //   ambil data soal berdasarkan topik id
  db.all(
    "SELECT * FROM questions WHERE topicId = ? ORDER BY id ASC",
    [topicId],
    (err, questions) => {
      if (err) {
        return res.send("An error occurred while retrieving the question data");
      }
      if (!questions || questions.length === 0) {
        return res.send("There are no questions for this topic");
      }

      //   ambil data jawaban siswa beserta nama dari tabel users
      const sql = `SELECT a.*, u.username
        FROM answers a
        JOIN users u ON a.userId = u.id
        WHERE a.topicId = ?
        ORDER BY u.id, a.questionId ASC
      `;

      db.all(sql, [topicId], (err, answerRows) => {
        if (err) {
          return res.send("An error occurred while retrieving answer data");
        }

        // grubkan jawaban berdasarkan masing masing siswa
        let studentMap = {};
        answerRows.forEach((row) => {
          if (!studentMap[row.userId]) {
            studentMap[row.userId] = {
              userId: row.userId,
              username: row.username,
              answers: {},
              totalScore: 0,
            };
          }

          studentMap[row.userId].answers[row.questionId] = {
            answer: row.answer,
            feedback: row.feedback,
            score: row.score,
          };
          studentMap[row.userId].totalScore += row.score || 0;
        });

        // ubah hasil grouping menjadi array
        let students = Object.values(studentMap);

        // render view dan kirim data questions dan students
        res.render("studentsAnswers/studentsAnswers", {
          topicId: topicId,
          questions: questions,
          students: students,
        });
      });
    }
  );
};
