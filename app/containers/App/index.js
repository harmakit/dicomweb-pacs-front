import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFoundPage from '../NotFoundPage/Loadable';
import DashboardPage from '../DashboardPage/Loadable';
import DashboardStudiesPage from '../DashboardStudiesPage/Loadable';
import { routes } from '../../utils/history';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path={routes.home} component={DashboardPage} />
        <Route
          exact
          path={routes.studies}
          render={() => (
            <DashboardPage>
              <DashboardStudiesPage />
            </DashboardPage>
          )}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
