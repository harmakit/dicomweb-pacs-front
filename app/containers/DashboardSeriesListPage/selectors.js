import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardSeries = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardSeries,
    state =>
      state.seriesLoading ||
      state.seriesTotalCountLoading ||
      state.studyObjectLoading,
  );

const makeSelectStudyObject = () =>
  createSelector(
    selectDashboardSeries,
    state => state.studyObject,
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
      if (state.seriesLoadingError) {
        errors.push(state.seriesLoadingError);
      }
      if (state.seriesTotalCountError) {
        errors.push(state.seriesTotalCountError);
      }
      if (state.studyObjectLoadingError) {
        errors.push(state.studyObjectLoadingError);
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
  makeSelectStudyObject,
};
