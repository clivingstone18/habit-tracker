import React from "react";
import "../form.css";

const UserForm = (props) => {
  return (
    <div className="form">
      <label>{props.type}</label>
      {props.type === "Register" ? (
        <input
          type="text"
          value={props.email}
          placeholder="Email"
          onChange={(e) => props.setEmail(e.target.value)}
          name="userEmail"
        />
      ) : null}

      <input
        type="text"
        value={props.username}
        placeholder="Username"
        onChange={(e) => props.setUsername(e.target.value)}
        name="userLogin"
      />
      <input
        type="password"
        value={props.password}
        placeholder="Password"
        onChange={(e) => props.setPassword(e.target.value)}
        name="userPassword"
      />
      <button onClick={props.handleClick}>{props.type}</button>
    </div>
  );
};

export default UserForm;
