import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from 'views/Loading';

import { RoutesPath } from './enums/routesPath';

const Landing = lazy(() => import("views/Landing"));
// const Board = lazy(() => import("./views/Board"));
const NewBoard = lazy(() => import("./views/NewBoard"));
const Styles = lazy(() => import("./views/ConfiguratedStyles"));
const Confirmation = lazy(() => import("./views/Confirmation"));
const Login = lazy(() => import("./views/Login"));
const Register = lazy(() => import("./views/Register"));

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={RoutesPath.Landing} exact component={Landing} />
          <Route path={RoutesPath.Board} component={NewBoard} />
          <Route path={RoutesPath.Styles} component={Styles} />
          <Route path={RoutesPath.Login} component={Login} />
          <Route path={RoutesPath.Register} component={Register} />
          <Route path={RoutesPath.Confirmation} component={Confirmation} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routes;
