import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

import { UserDetails } from "../../utils/models/UserDetails";
import { isAuthenticated } from "../../utils/Utils";

interface Props extends RouteProps {
  userDetails?: UserDetails;
  redirectUrl: string;
}

export const PublicRoute = (props: Props) => {
  return isAuthenticated(props.userDetails) ? <Redirect to={{ pathname: props.redirectUrl }} exact /> : <Route {...props} />;
};
