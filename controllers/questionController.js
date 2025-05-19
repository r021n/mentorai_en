const questionModel = require("../models/questionModel");

exports.getQuestions = (req, res) => {
  const topicId = req.params.id_topic;
  const db = req.db;
  questionModel.getAllByTopic(db, topicId, (err, questions) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.render("questions/list", {
      topicId,
      questions: questions,
    });
  });
};

exports.getAddQuestion = (req, res) => {
  const topicId = req.params.id_topic;
  res.render("questions/create", { topicId });
};

exports.postAddQuestion = (req, res) => {
  const rawTopicId = req.params.id_topic;
  const topicId = parseInt(rawTopicId.trim());
  const db = req.db;

  //data soal diambil dari tetx editor, deskripsi gambar, dan file upload
  const newQuestion = {
    question: req.body.question,
    pathImage: req.file ? "/uploads/" + req.file.filename : null,
    imageDescription: req.body.imageDescription,
    topicId: topicId,
  };

  questionModel.create(db, newQuestion, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // res.redirect("/topics/list" + topicId);
    res.redirect("/topics/list/" + topicId);
  });
};

exports.getEditQuestion = (req, res) => {
  const topicId = req.params.id_topic;
  const questionId = req.params.id;
  const db = req.db;
  questionModel.getById(db, questionId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    const question = results[0];
    res.render("questions/edit", { topicId, question });
  });
};

exports.postEditQuestion = (req, res) => {
  const topicId = req.params.id_topic;
  const questionId = req.params.id;
  const updatedQuestion = {
    question: req.body.question,
    imageDescription: req.body.imageDescription,
  };

  if (req.file) {
    updatedQuestion.pathImage = "/uploads/" + req.file.filename;
  }

  const db = req.db;
  questionModel.update(db, questionId, updatedQuestion, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect("/topics/list/" + topicId);
  });
};

exports.deleteQuestion = (req, res) => {
  const topicId = req.params.id_topic;
  const id = req.params.id;
  const db = req.db;

  questionModel.delete(db, id, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect("/topics/list/" + topicId);
  });
};
