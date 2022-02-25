import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDashboardSeries = state => state.dashboardSeries || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardSeries,
    state => state.loading || state.totalCountLoading || state.studyLoading,
  );

const makeSelectStudy = () =>
  createSelector(
    selectDashboardSeries,
    state => state.study,
  );

const makeSelectSeries = () =>
  createSelector(
    selectDashboardSeries,
    state => state.series,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardSeries,
    state => {
      const errors = [];
      if (state.error) {
        errors.push(state.error);
      }
      if (state.seriesTotalError) {
        errors.push(state.seriesTotalError);
      }
      if (state.studyLoadingError) {
        errors.push(state.studyLoadingError);
      }
      return errors;
    },
  );

const makeSelectSeriesTotalCount = () =>
  createSelector(
    selectDashboardSeries,
    state => state.seriesTotalCount,
  );

export {
  selectDashboardSeries,
  makeSelectSeriesTotalCount,
  makeSelectLoading,
  makeSelectSeries,
  makeSelectErrors,
  makeSelectStudy,
};
