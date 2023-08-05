import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../layout/Auth";

const PrivateRoute = ({ component: Component, requiredRoles, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          // If user is not logged in, redirect to login page
          return <Redirect to="/login" />;
        } else if (!requiredRoles.includes(user.role)) {
          // If user's role is not included in the required roles, redirect to not authorized page
          return <Redirect to="/not-authorized" />;
        } else {
          // If user is logged in and has the required role, render the component
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
