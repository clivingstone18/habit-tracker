import React, { useState, useEffect } from "react";
import axios from "axios";
import Habit from "../components/Habit.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const HabitsList = (props) => {
  const [showAll, setShowAll] = useState(false);

  function deleteHabit(id) {
    axios.delete("http://localhost:5000/habits/" + id).then((res) => {
      props.updateHabitArray(props.habits.filter((habit) => habit._id !== id));
    });
  }

  function sendUpdateRequest(habit) {
    axios
      .post("http://localhost:5000/habits/update/" + habit._id, habit)
      .then((res) => {
        let newArray = props.habits.map((previousHabit) =>
          previousHabit._id === res.data._id ? res.data : previousHabit
        );
        props.updateHabitArray(newArray);
      })
      .catch((err) => console.log(err));
  }

  function notCheckedYet(habit) {
    if (habit.datesCompleted.length === 0) return true;
    return (
      habit.datesCompleted.length === 0 ||
      habit.datesCompleted[habit.datesCompleted.length - 1].date
        .toString()
        .substring(0, 10) !== new Date().toISOString().substring(0, 10)
    );
  }

  function updateHabitStatus(habit) {
    //Handles the toggle
    if (notCheckedYet(habit)) {
      habit.datesCompleted.push({
        date: new Date().toISOString(),
        completed: true,
      });
    } else {
      console.log("slicing!");
      habit.datesCompleted = habit.datesCompleted.slice(0, -1);
    }
    sendUpdateRequest(habit);
  }

  function addUncompletedDates(habit) {
    const todaysDate = Date.parse(new Date());
    const lastDayCompleted = habit.datesCompleted[
      habit.datesCompleted.length - 1
    ].date.substring(0, 10);

    let daysSinceCompleted = Math.floor(
      (todaysDate -
        Date.parse(
          habit.datesCompleted[habit.datesCompleted.length - 1].date
        )) /
        (1000 * 60 * 60 * 24)
    );
    let i = daysSinceCompleted;

    while (i > 0) {
      if (
        new Date(todaysDate - 864e5 * i).toISOString().substring(0, 10) !==
        lastDayCompleted
      ) {
        habit.datesCompleted.push({
          date: new Date(todaysDate - 864e5 * i).toISOString(),
          completed: false,
        });
      }
      i--;
    }
    sendUpdateRequest(habit);
  }

  return (
    <div className="habitsList">
      {!props.habits.filter((habit) => notCheckedYet(habit)).length ? (
        <div className="checked">
          <h3>You're all caught up! </h3>
          <FontAwesomeIcon className="check-icon" icon={faCheckCircle} />
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "Hide completed habits" : "Show completed habits"}
          </button>
        </div>
      ) : (
        <div>
          <h3>Up for today</h3>
          {props.habits
            .filter((habit) => notCheckedYet(habit))
            .map((habit) => (
              <Habit
                habit={habit}
                deleteHabit={deleteHabit}
                updateHabitStatus={updateHabitStatus}
                updateHabitArray={props.updateHabitArray}
                addUncompletedDates={addUncompletedDates}
                notCheckedYet={notCheckedYet}
                key={habit._id}
                sendUpdateRequest={sendUpdateRequest}
                editing={props.editing}
              />
            ))}
        </div>
      )}
      {showAll ? (
        <div>
          <h3>Already completed</h3>
          {props.habits
            .filter((habit) => !notCheckedYet(habit))
            .map((habit) => (
              <Habit
                habit={habit}
                deleteHabit={deleteHabit}
                updateHabitStatus={updateHabitStatus}
                updateHabitArray={props.updateHabitArray}
                addUncompletedDates={addUncompletedDates}
                notCheckedYet={notCheckedYet}
                key={habit._id}
                sendUpdateRequest={sendUpdateRequest}
                editing={props.editing}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default HabitsList;
