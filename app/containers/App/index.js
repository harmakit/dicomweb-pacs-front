import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { routes } from '../../utils/history';
import NotFoundPage from '../NotFoundPage/Loadable';
import DashboardPage from '../DashboardPage/Loadable';
import DashboardStudyListPage from '../DashboardStudyListPage/Loadable';
import DashboardSeriesListPage from '../DashboardSeriesListPage/Loadable';
import DashboardInstanceListPage from '../DashboardInstanceListPage/Loadable';
import DashboardInstancePage from '../DashboardInstancePage/Loadable';
import DashboardViewImagesPage from '../DashboardViewImagesPage/Loadable';
import DashboardHomePage from '../DashboardHomePage/Loadable';
import DashboardUploadImagePage from '../DashboardUploadImagePage/Loadable';

export default function App() {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={routes.home}
          render={() => (
            <DashboardPage>
              <DashboardHomePage />
            </DashboardPage>
          )}
        />
        <Route
          exact
          path={routes.studyList}
          render={() => (
            <DashboardPage>
              <DashboardStudyListPage />
            </DashboardPage>
          )}
        />
        <Route
          exact
          path={routes.seriesList}
          render={() => (
            <DashboardPage>
              <DashboardSeriesListPage />
            </DashboardPage>
          )}
        />
        <Route
          exact
          path={routes.instanceList}
          render={() => (
            <DashboardPage>
              <DashboardInstanceListPage />
            </DashboardPage>
          )}
        />
        <Route
          exact
          path={routes.instance}
          render={() => (
            <DashboardPage>
              <DashboardInstancePage />
            </DashboardPage>
          )}
        />
        <Route
          exact
          path={routes.viewImages}
          render={() => (
            <DashboardPage>
              <DashboardViewImagesPage />
            </DashboardPage>
          )}
        />
        <Route
          exact
          path={routes.upload}
          render={() => (
            <DashboardPage>
              <DashboardUploadImagePage />
            </DashboardPage>
          )}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}
