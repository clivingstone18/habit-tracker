import React, { useState, useEffect } from "react";
import axios from "axios";
import "../dashboard.css";

const CreateHabit = (props) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(0);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    let isMounted = true;
    return () => {
      isMounted = false;
    };
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const habit = {
      username: props.username,
      name: name,
      duration: duration,
      startDate: startDate,
    };
    axios
      .post("http://localhost:5000/habits/add", habit)
      .then((res) => {
        props.setHabits(res.data);
        props.setIsAdding(false);
        setName("");
        setDuration(0);
        setStartDate(new Date());
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="habit">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name of habit"
      />
      <input
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration of habit in minutes"
      />
      <button onClick={onSubmit}>Add</button>
      <button onClick={() => props.setIsAdding(false)}>Cancel</button>
    </div>
  );
};

export default CreateHabit;
