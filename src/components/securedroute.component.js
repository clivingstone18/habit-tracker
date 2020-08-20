import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Redirect } from "react-router";

export default function SecuredRoute({ component: Component, ...rest }) {
  console.log(rest);
  return (
    <Route
      {...rest}
      render={(props) =>
        rest.loggedInStatus === "LOGGED_IN" ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}
