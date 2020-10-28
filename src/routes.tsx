import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loading from 'views/Loading';

import { RoutesPath } from './enums/routesPath';

const Landing = lazy(() => import("views/Landing"));
const Board = lazy(() => import("./views/Board"));
const Styles = lazy(() => import("./views/ConfiguratedStyles"));
const Confirmation = lazy(() => import("./views/Confirmation"));
const Login = lazy(() => import("./views/Login"));
const Register = lazy(() => import("./views/Register"));

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={RoutesPath.Landing} exact component={Landing} />
          <Route path={RoutesPath.Board} component={Board} />
          <Route path={RoutesPath.Styles} component={Styles} />
          <Route path={RoutesPath.Login} component={Login} />
          <Route path={RoutesPath.Register} component={Register} />
          <Route path={RoutesPath.Confirmation} component={Confirmation} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
