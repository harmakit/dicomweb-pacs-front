import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardSeries = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardSeries,
    state => state.loading || state.totalCountLoading || state.seriesLoading,
  );

const makeSelectSeries = () =>
  createSelector(
    selectDashboardSeries,
    state => state.series,
  );

const makeSelectInstances = () =>
  createSelector(
    selectDashboardSeries,
    state => state.instances,
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
        errors.push(state.instancesTotalError);
      }
      if (state.studyLoadingError) {
        errors.push(state.seriesLoadingError);
      }
      return errors;
    },
  );

const makeSelectInstancesTotalCount = () =>
  createSelector(
    selectDashboardSeries,
    state => state.instancesTotalCount,
  );

export {
  selectDashboardSeries,
  makeSelectInstances,
  makeSelectInstancesTotalCount,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectSeries,
};
