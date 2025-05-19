const ExcelJS = require("exceljs");

exports.downloadTopicExcel = (req, res) => {
  const topicId = req.params.topicId;
  const db = req.db;

  // 1. Get question data based on topicId
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

      // 2. Get student answers along with their names from the users table
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

        // 3. Group answers by student
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
        let students = Object.values(studentMap);

        // 4. Create excel file using exceljs
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Student Answer Data");

        // Create headers dynamically
        let headerRow = ["No", "Student Name"];
        questions.forEach((question, index) => {
          headerRow.push(`Answer ${index + 1}`);
          headerRow.push(`Feedback ${index + 1}`);
        });
        headerRow.push("Total Score");
        worksheet.addRow(headerRow);

        // Style header (e.g., bold)
        worksheet.getRow(1).font = { bold: true };

        // 5. Add rows for each student
        students.forEach((student, index) => {
          let rowData = [];
          rowData.push(index + 1);
          rowData.push(student.username);

          // Check if there is an answer for each question, leave blank if not
          questions.forEach((question) => {
            if (student.answers[question.id]) {
              rowData.push(student.answers[question.id].answer);
              rowData.push(student.answers[question.id].feedback);
            } else {
              rowData.push("");
              rowData.push("");
            }
          });

          rowData.push(
            Math.round((student.totalScore / (questions.length * 3)) * 100)
          );

          worksheet.addRow(rowData);
        });

        // Set column widths
        // =================================

        // No column
        worksheet.getColumn(1).width = 5;

        // Student Name column
        worksheet.getColumn(2).width = 20;

        // Answer and Feedback columns
        let currentColumn = 3;
        questions.forEach(() => {
          worksheet.getColumn(currentColumn).width = 30;
          worksheet.getColumn(currentColumn + 1).width = 40;
          currentColumn += 2;
        });

        // Total Score column
        worksheet.getColumn(currentColumn).width = 15;

        // Set response headers and send file as download
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="Report_Topic_${topicId}.xlsx"`
        );

        workbook.xlsx
          .write(res)
          .then(() => res.end())
          .catch((err) => {
            console.error(err);
            res.send("An error occurred while creating the excel file");
          });
      });
    }
  );
};
