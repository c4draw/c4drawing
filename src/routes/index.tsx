import React, { lazy } from "react";
import { Switch, Route as RouterWithoutValidation } from "react-router-dom";

import { RoutesPath } from "../enums/routesPath";
import Route from "./Route";

const Landing = lazy(() => import("views/Landing"));
const Board = lazy(() => import("../views/Board"));
const Styles = lazy(() => import("../views/ConfiguratedStyles"));
const Confirmation = lazy(() => import("../views/Confirmation"));
const Login = lazy(() => import("../views/Login"));
const Register = lazy(() => import("../views/Register"));

const Routes: React.FC = () => {
  return (
    <Switch>
      <RouterWithoutValidation
        path={RoutesPath.Landing}
        exact
        component={Landing}
      />
      <Route path={RoutesPath.Board} component={Board} isPrivate />
      <RouterWithoutValidation path={RoutesPath.Styles} component={Styles} />
      <RouterWithoutValidation path={RoutesPath.Login} component={Login} />
      <RouterWithoutValidation
        path={RoutesPath.Register}
        component={Register}
      />
      <RouterWithoutValidation
        path={RoutesPath.Confirmation}
        component={Confirmation}
      />
    </Switch>
  );
};

export default Routes;
