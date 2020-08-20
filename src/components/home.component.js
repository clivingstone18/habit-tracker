import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./user-form.component";
import Button from "./button.component";
import "../home.css";

export default function Home(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      props.checkLoginStatus();
      if (props.isLoggedIn === "LOGGED_IN") {
        props.history.push("/dashboard");
      }
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSuccessfulAuth = (data) => {
    props.handleLogin(data);
    setLoginUsername("");
    setLoginPassword("");
    setIsLoading(false);
    props.history.push("/dashboard");
  };

  const login = () => {
    axios({
      method: "post",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:5000/login",
    })
      .then((res) => {
        if (res.data.status === "Successfully Authenticated") {
          handleSuccessfulAuth(res.data);
          setIsLoading(false);
        }
        if (res.data === "No User Exists") {
          setErrors({
            username: "Incorrect username or password",
          });
        }
      })
      .catch((err) => console.log("Failed"));
  };

  const register = () => {
    axios({
      method: "post",
      data: {
        username: registerUsername,
        password: registerPassword,
        email: registerEmail,
      },
      withCredentials: true,
      url: "http://localhost:5000/register",
    }).then((res) => {
      if (res.data.status === "Successful Registration") {
        axios({
          method: "post",
          data: {
            username: registerUsername,
            password: registerPassword,
          },
          withCredentials: true,
          url: "http://localhost:5000/login",
        })
          .then((res) => {
            console.log(res);
            if (res.data.status === "Successfully Authenticated") {
              handleSuccessfulAuth(res.data);
            }
          })
          .catch((err) => console.log("Failed"));
      } else {
        setErrors({
          register:
            "The username " + registerUsername + " has already been taken!",
        });
      }
    });
  };

  const changeStatus = (val) => {
    setRegistering(val);
  };

  if (isLoading) {
    return <p>Loading</p>;
  } else {
    return (
      <div className="home">
        <div className="header">
          <h1>Habit Tracker </h1>
          <h2>
            Begin habit tracking with streaks, detailed statistics, and
            personalised insights
          </h2>
        </div>

        {!registering ? (
          <UserForm
            type="Login"
            username={loginUsername}
            password={loginPassword}
            setUsername={setLoginUsername}
            setPassword={setLoginPassword}
            handleClick={login}
          />
        ) : (
          <UserForm
            type="Register"
            username={registerUsername}
            password={registerPassword}
            email={registerEmail}
            setUsername={setRegisterUsername}
            setPassword={setRegisterPassword}
            setEmail={setRegisterEmail}
            handleClick={register}
          />
        )}

        <Button
          buttonText={registering ? "Login" : "Register"}
          handleClick={changeStatus}
          status={registering}
          className="btn"
        />
      </div>
    );
  }
}
