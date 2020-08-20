import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const Habit = (props) => {
  const [isEditing, setEditing] = useState(false);
  const [editedHabit, setEditedHabit] = useState("");
  const [duration, setDuration] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (props.habit.datesCompleted.length) {
      props.addUncompletedDates(props.habit);
    }
  }, []);

  const handleClick = () => {
    if (!isEditing) {
      setEditedHabit(props.habit.name);
      setEditing(!isEditing);
      return;
    }
    const updatedHabit = {
      name: editedHabit,
      duration: duration,
      datesCompleted: props.habit.datesCompleted,
      startDate: props.habit.startDate,
    };
    axios
      .post(
        "http://localhost:5000/habits/update/" + props.habit._id,
        updatedHabit
      )
      .then((res) => {
        props.sendUpdateRequest(res.data);
        setEditing(!isEditing);
      });
  };

  return (
    <div className="habit">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedHabit}
            onChange={(e) => setEditedHabit(e.target.value)}
          />

          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <button onClick={handleClick}>Save</button>
        </>
      ) : (
        <>
          {!showDetails && !props.editing ? (
            <input
              type="checkbox"
              checked={!props.notCheckedYet(props.habit)}
              onClick={() => {
                props.updateHabitStatus(props.habit);
              }}
            />
          ) : null}
          <p>{!showDetails && props.habit.name}</p>
          <p>{!showDetails && props.habit.duration}</p>
          {showDetails ? <p>Current streak: {props.habit.streak}</p> : null}
          {showDetails ? (
            <p>Longest streak: {props.habit.longestStreak}</p>
          ) : null}
          {showDetails ? (
            <p>Percent compliance: {props.habit.percentCompliance}%</p>
          ) : null}

          {props.editing ? (
            <button onClick={handleClick}>
              {" "}
              <FontAwesomeIcon icon={faEdit} />
            </button>
          ) : null}
          {props.editing ? (
            <button
              onClick={() => {
                props.deleteHabit(props.habit._id);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          ) : null}
          {!props.editing ? (
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? (
                <FontAwesomeIcon icon={faMinus} />
              ) : (
                <FontAwesomeIcon icon={faPlus} />
              )}
            </button>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Habit;
