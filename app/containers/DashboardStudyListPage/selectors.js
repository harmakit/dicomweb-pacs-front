import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardStudyList = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardStudyList,
    state => state.loading || state.totalCountLoading,
  );

const makeSelectStudies = () =>
  createSelector(
    selectDashboardStudyList,
    state => state.studies,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardStudyList,
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
    selectDashboardStudyList,
    state => state.studiesTotalCount,
  );

export {
  selectDashboardStudyList,
  makeSelectStudiesTotalCount,
  makeSelectLoading,
  makeSelectStudies,
  makeSelectErrors,
};
