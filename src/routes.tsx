import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { RoutesPath } from './enums/routesPath';
import Board from './views/Board';
import Styles from './views/ConfiguratedStyles';
import Confirmation from './views/Confirmation';
import Landing from './views/Landing';
import Login from './views/Login';
import Register from './views/Register';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={RoutesPath.Landing} exact component={Landing} />
        <Route path={RoutesPath.Board} component={Board} />
        <Route path={RoutesPath.Styles} component={Styles} />
        <Route path={RoutesPath.Login} component={Login} />
        <Route path={RoutesPath.Register} component={Register} />
        <Route path={RoutesPath.Confirmation} component={Confirmation} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
