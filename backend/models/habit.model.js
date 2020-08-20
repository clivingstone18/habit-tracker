const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const habitSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  datesCompleted: [
    {
      date: { type: Date, required: true },
      completed: { type: Boolean, required: true },
    },
  ],
  duration: { type: [Number], required: true },
  streak: Number,
  longestStreak: Number,
  percentCompliance: Number,
});

var Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;
