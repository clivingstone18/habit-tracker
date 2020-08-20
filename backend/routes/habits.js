var express = require("express");
var router = express.Router();
var Habit = require("../models/habit.model");
var dateFunctions = require("../helpers/datesLogic");

router.route("/").get((req, res) => {
  Habit.find({ username: req.user.username })
    .then((habits) => res.json(habits))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const duration = Number(req.body.duration);
  const startDate = Date.parse(req.body.startDate);

  const newHabit = new Habit({
    username: username,
    name: name,
    startDate: startDate,
    duration: duration,
    streak: 0,
    percentCompliance: 0,
    longestStreak: 0,
  });
  newHabit.save().then((habit) => {
    res.send(habit);
  });
});

router.route("/:id").get((req, res) => {
  Habit.findById(req.params.id)
    .then((habit) => res.json(habit))
    .catch((err) => res.status(400).json(`Error:${err}`));
});

router.route("/update/:id").post((req, res) => {
  Habit.findById(req.params.id)
    .then((habit) => {
      habit.name = req.body.name;
      habit.duration = Number(req.body.duration);
      habit.startDate = Date.parse(req.body.startDate);
      habit.datesCompleted = req.body.datesCompleted;
      habit.streak = dateFunctions.getStreak(req.body.datesCompleted);
      habit.longestStreak = dateFunctions.getLongestStreak(
        req.body.datesCompleted
      );
      habit.percentCompliance = dateFunctions.getPercentCompliance(
        req.body.datesCompleted
      );

      habit
        .save()
        .then((data) => {
          res.send(data);
          console.log(data);
        })
        .catch((err) => res.status(400).json(`Error:${err}`));
    })
    .catch((err) => res.status(400).json(`Error:${err}`));
});

router.route("/:id").delete((req, res) => {
  Habit.findByIdAndDelete(req.params.id)
    .then((habit) => res.json(habit))
    .catch((err) => res.status(400).json(`Error:${err}`));
});

module.exports = router;
