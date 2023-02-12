import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboard = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboard,
    state => state.summaryDataLoading,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboard,
    state => {
      const errors = [];
      if (state.summaryDataLoadingError) {
        errors.push(state.summaryDataLoadingError);
      }
      return errors;
    },
  );

const makeSelectSummaryData = () =>
  createSelector(
    selectDashboard,
    state => state.summaryData,
  );

export {
  selectDashboard,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectSummaryData,
};
