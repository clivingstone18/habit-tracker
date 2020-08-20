import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";

import Home from "./components/home.component";
import Dashboard from "./components/dashboard.component";
import SecuredRoute from "./components/securedroute.component";

export default function App() {
  const [isLoggedIn, setLogIn] = useState("NOT_LOGGED_IN");
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = (data) => {
    setLogIn("LOGGED_IN");
    setUser(data.user.username);
  };

  const handleLogout = () => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/logout",
    })
      .then((res) => {
        setLogIn("NOT_LOGGED_IN");
        setUser("");
        setLoading(true);
      })
      .catch((err) => console.log("Logout failed, try again!"));
  };

  const checkLoginStatus = () => {
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => {
        if (res.data.status === "Logged In" && isLoggedIn === "NOT_LOGGED_IN") {
          handleLogin(res.data);
          setLoading(false);
        } else if (
          res.data.status === "Logged Out" &&
          isLoggedIn === "LOGGED_IN"
        ) {
          setLogIn("NOT_LOGGED_IN");
          setUser("");
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    return (
      <Router>
        <SecuredRoute
          path={"/dashboard"}
          exact
          loggedInStatus={isLoggedIn}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          checkLoginStatus={checkLoginStatus}
          component={Dashboard}
          user={user}
        />

        <Route
          path={"/"}
          exact
          render={(props) => (
            <Home
              {...props}
              user={user}
              checkLoginStatus={checkLoginStatus}
              handleLogin={handleLogin}
              isLoggedIn={isLoggedIn}
            />
          )}
        />
      </Router>
    );
  }
}
