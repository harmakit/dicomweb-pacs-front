import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardInstance = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardInstance,
    state => state.instanceObjectLoading,
  );

const makeSelectInstanceObject = () =>
  createSelector(
    selectDashboardInstance,
    state => state.instanceObject,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardInstance,
    state => {
      const errors = [];
      if (state.instanceObjectLoadingError) {
        errors.push(state.instanceObjectLoadingError);
      }
      return errors;
    },
  );

export {
  selectDashboardInstance,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectInstanceObject,
};
