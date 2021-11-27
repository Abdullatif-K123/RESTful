const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
mongoose.connect("mongodb://localhost:27017/WikiDB");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", " ejs");
app.use(express.static("public"));

//making a mongoose Shecma
const articlDB = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const article = mongoose.model("articles", articlDB);

// Articles route app

app
  .route("/articles")

  .get(function (req, res) {
    article.find({}, function (err, found) {
      if (!err) res.send(found);
      else res.send(err);
    });
  })
  .post(function (req, res) {
    const titles = req.body.titles;
    const content = req.body.content;

    const newArticle = new article({
      title: titles,
      content: content,
    });
    newArticle.save(function (err) {
      if (err) console.log(err);
    });
    res.redirect("/articles");
  })
  .delete(function (req, res) {
    article.deleteMany({}, function (err) {
      if (err) res.send(err);
      else res.send("Sucessfully deleted");
    });
  });

/////////////////////////// New Rout root for artices;//////////////////////
app
  .route("/articles/:titleArticle")
  .get(function (req, res) {
    const titleArticle = req.params.titleArticle;
    article.findOne({ title: titleArticle }, function (err, found) {
      if (found) res.send(found);
      else res.send("didn't found the articles");
    });
  })
  .put(function (req, res) {
    const titleArticle = req.params.titleArticle;
    article.findOneAndUpdate(
      { title: titleArticle },
      { title: req.body.titles, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) res.send("Ok");
      }
    );
  })
  //Patch
  .patch(function (req, res) {
    const titleArticle = req.params.titleArticle;
    article.updateOne(
      { title: titleArticle },
      { content: req.body.content },
      function (err) {
        if (!err) res.send("success");
      }
    );
  })
  .delete(function (req, res) {
    const titleArticle = req.params.titleArticle;
    article.deleteOne({ title: titleArticle }, function (err) {
      if (!err) res.send("no err");
    });
  });
// Create a route !!!
const port = 3000 || Process.env.port;
app.listen(port, function () {
  console.log("Running !!");
});
