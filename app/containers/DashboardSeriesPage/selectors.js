import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardSeries = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardSeries,
    state =>
      state.instancesLoading ||
      state.instancesTotalCountLoading ||
      state.seriesObjectLoading,
  );

const makeSelectSeriesObject = () =>
  createSelector(
    selectDashboardSeries,
    state => state.seriesObject,
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
      if (state.instancesLoadingError) {
        errors.push(state.instancesLoadingError);
      }
      if (state.instancesTotalCountError) {
        errors.push(state.instancesTotalCountError);
      }
      if (state.seriesObjectLoadingError) {
        errors.push(state.seriesObjectLoadingError);
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
  makeSelectSeriesObject,
};
