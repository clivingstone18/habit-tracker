import React from "react";
import "../button.css";

const Button = (props) => {
  return (
    <button className="main" onClick={() => props.handleClick(!props.status)}>
      {props.buttonText}
    </button>
  );
};

export default Button;
