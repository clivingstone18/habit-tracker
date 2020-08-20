const onConsecutiveDays = (date1, date2) => {
  const timeDiffHours =
    (Date.parse(date1) - Date.parse(date2)) / (1000 * 60 * 60);
  return timeDiffHours < 24;
};

const getStreak = (dates) => {
  let currStreak = 0;
  let i = dates.length - 1;
  while (i >= 0) {
    if (dates[i].completed) {
      currStreak++;
      i--;
    } else {
      break;
    }
  }
  return currStreak;
};

const getLongestStreak = (dates) => {
  let longestStreak = 0;
  let currLongestStreak = 0;
  console.log(dates.length);

  for (let i = 0; i < dates.length; i++) {
    if (dates[i].completed) {
      //increase longest streak length
      currLongestStreak++;
    }
    if (currLongestStreak >= longestStreak) {
      longestStreak = currLongestStreak;
    } else {
      currLongestStreak = 0;
    }
  }
  console.log("Longest streak: " + longestStreak);
  return longestStreak;
};

const getPercentCompliance = (dates) => {
  if (dates.length == 0) {
    return 0;
  }
  let successfulDays = dates.filter((date) => date.completed);
  return Math.round((100 * successfulDays.length) / dates.length);
};

module.exports = {
  getStreak,
  onConsecutiveDays,
  getLongestStreak,
  getPercentCompliance,
};
