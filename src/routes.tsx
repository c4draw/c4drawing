import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { RoutesPath } from './enums/routesPath';
import Board from './views/Board';
import Styles from './views/ConfiguratedStyles';
import Landing from './views/Landing';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={RoutesPath.Landing} exact component={Landing} />
        <Route path={RoutesPath.Board} component={Board} />
        <Route path={RoutesPath.Styles} component={Styles} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
