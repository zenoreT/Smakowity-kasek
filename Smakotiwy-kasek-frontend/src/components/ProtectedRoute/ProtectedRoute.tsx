import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

import { UserDetails } from "../../utils/models/UserDetails";
import { isAuthenticated } from "../../utils/Utils";
import { Spin } from "antd";
import { Role } from "../../utils/models/Role";

interface Props extends RouteProps {
  userDetails?: UserDetails;
  requiredRoles?: Role[];
  redirectUrl: string;
}

export const ProtectedRoute = (props: Props) => {
  if (!props.userDetails) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 141px)",
        }}
      />
    );
  }

  return isAuthenticated(props.userDetails, props.requiredRoles) ? <Route {...props} /> : <Redirect to={{ pathname: props.redirectUrl }} exact />;
};
