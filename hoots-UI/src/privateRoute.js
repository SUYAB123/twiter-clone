import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = (props) => {
  const { homeAuthenticated } = props;
  const id = useSelector((state) => state.profile.user.id);
  let isAuthenticated = false;
  try {
    if (id !== undefined && id !== "" ) {
      isAuthenticated = true;
    }
  } catch (err) {
    isAuthenticated = false;
  }

  if (homeAuthenticated)
    return isAuthenticated ? (
      <Redirect to={{ pathname: "/home" }} />
    ) : (
      <Route {...props} />
    );

  return isAuthenticated ? (
    <Route {...props} />
  ) : (
    <Redirect to={{ pathname: "/" }} />
  );
};

export default PrivateRoute;
