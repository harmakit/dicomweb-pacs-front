import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDashboardStudies = state => state.dashboardStudies || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardStudies,
    state => state.loading || state.totalCountLoading,
  );

const makeSelectStudies = () =>
  createSelector(
    selectDashboardStudies,
    state => state.studies,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardStudies,
    state => {
      const errors = [];
      if (state.error) {
        errors.push(state.error);
      }
      if (state.studiesTotalError) {
        errors.push(state.studiesTotalError);
      }
      return errors;
    },
  );

const makeSelectStudiesTotalCount = () =>
  createSelector(
    selectDashboardStudies,
    state => state.studiesTotalCount,
  );

export {
  selectDashboardStudies,
  makeSelectStudiesTotalCount,
  makeSelectLoading,
  makeSelectStudies,
  makeSelectErrors,
};
