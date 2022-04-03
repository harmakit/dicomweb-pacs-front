import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardStudyList = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardStudyList,
    state => state.studiesLoading || state.studiesTotalCountLoading,
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
      if (state.studiesLoadingError) {
        errors.push(state.studiesLoadingError);
      }
      if (state.studiesTotalCountError) {
        errors.push(state.studiesTotalCountError);
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
