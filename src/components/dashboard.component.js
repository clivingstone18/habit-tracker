import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateHabit from "./create-habit.component";
import HabitsList from "./habits-list.component";
import Button from "./button.component";
import "../dashboard.css";
import "../button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard(props) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Retrieves the name of the user that is logged in and habits associated with their username
  useEffect(() => {
    axios
      .get("http://localhost:5000/habits", { withCredentials: true })
      .then((res) => {
        setHabits(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleLogoutClick() {
    axios
      .get("http://localhost:5000/logout", { withCredentials: true })
      .then((response) => {
        props.handleLogout();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const addHabit = (habit) => {
    setHabits((prevHabitArray) => [...prevHabitArray, habit]);
  };

  const updateHabitArray = (newHabitArray) => {
    setHabits(newHabitArray);
  };

  const handleClick = (val) => {
    setIsAdding(val);
  };

  if (isLoading) {
    return <p>Page is loading</p>;
  }

  return (
    <div className="container">
      <div className="user">
        <h1 className="info">
          <FontAwesomeIcon icon={faUser} />
          {props.user}
        </h1>
        <h1># of Active Habits: {habits.length}</h1>

        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            "Quit editing"
          ) : (
            <p>
              <FontAwesomeIcon icon={faEdit} />
              Enter edit mode
            </p>
          )}
        </button>
        <button onClick={handleLogoutClick}>
          {" "}
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      </div>

      <div className="habitsSection">
        {isLoading ? <p> Please wait for habits to load! </p> : null}

        {habits.length ? (
          <HabitsList
            habits={habits}
            updateHabitArray={updateHabitArray}
            isAdding={isAdding}
            editing={isEditing}
          />
        ) : (
          <p>You haven't started adding habits yet!</p>
        )}

        {isAdding ? (
          <CreateHabit
            username={props.user}
            habits={habits}
            setHabits={addHabit}
            setIsAdding={handleClick}
          />
        ) : (
          <Button
            handleClick={handleClick}
            buttonText="Add more habits"
            status={isAdding}
          />
        )}
      </div>
    </div>
  );
}
