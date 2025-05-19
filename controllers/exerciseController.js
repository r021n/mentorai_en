const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// =========================================================
// function to generate feedback
async function generateFeedback(inputText) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenAI({ apiKey: apiKey });
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: inputText,
  });
  return response.text;
}

// function to get question from database
function getQuestionById(db, questionId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT question FROM questions WHERE id = ?",
      [questionId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error("Question not found"));
        } else {
          resolve(row.question);
        }
      }
    );
  });
}

// =========================================================

exports.getExcerciseTopics = (req, res) => {
  const user = req.session.user;
  const db = req.db;

  db.all("SELECT * FROM topics", (err, topics) => {
    if (err) {
      return res.send("An error occurred while getting topics");
    }

    res.render("exercise/topics", { user, topics });
  });
};

exports.getExercisePage = (req, res) => {
  const topicId = req.params.topicId;
  const userId = req.session.user.id;
  const db = req.db;

  // get question data based on topic id
  db.all(
    "SELECT * FROM questions WHERE topicId = ? ORDER BY id ASC",
    [topicId],
    (err, questions) => {
      if (err || !questions) {
        return res.send("An error occurred while retrieving question data");
      }

      // get answer data for this user on this topic
      db.all(
        "SELECT * FROM answers WHERE topicId = ? AND userId = ?",
        [topicId, userId],
        (err, answers) => {
          if (err) {
            return res.send("An error occurred while retrieving answer data");
          }

          res.render("exercise/exercise", {
            topicId: topicId,
            questions: JSON.stringify(questions),
            answers: JSON.stringify(answers),
          });
        }
      );
    }
  );
};

exports.postSubmitAnswer = async (req, res) => {
  const topicId = req.params.topicId;
  const userId = req.session.user.id;
  const { questionId, answer } = req.body;
  // generate dummy feedback and score
  const score = 3;
  const db = req.db;

  // get question from database and make the prompt
  const question = await getQuestionById(db, questionId);
  const prompt = `Please provide brief educational feedback (maximum 3 sentences) for the following question "${question}" regarding the following answer "${answer}"`;
  let feedback = await generateFeedback(prompt);

  // check if an answer record already exists
  db.get(
    "SELECT * FROM answers WHERE userId = ? AND questionId = ? AND topicId = ?",
    [userId, questionId, topicId],
    (err, row) => {
      if (err) {
        return res.json({ success: false, message: "Error during query" });
      }

      if (row) {
        // update existing answer
        db.run(
          "UPDATE answers SET answer = ?, feedback = ?, score = ? WHERE id = ?",
          [answer, feedback, score, row.id],
          (err) => {
            if (err) {
              return res.json({
                success: false,
                message: "Failed to update answer",
              });
            }
            return res.json({
              success: true,
              feedback: feedback,
            });
          }
        );
      } else {
        // insert new answer
        db.run(
          "INSERT INTO answers (answer, feedback, score, userId, questionId, topicId) VALUES (?, ?, ?, ?, ?, ?)",
          [answer, feedback, score, userId, questionId, topicId],
          (err) => {
            if (err) {
              return res.json({
                success: false,
                message: "Failed to save answer",
              });
            }

            return res.json({
              success: true,
              feedback: feedback,
            });
          }
        );
      }
    }
  );
};
