import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardViewImages = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardViewImages,
    state => state.instancesLoading,
  );

const makeSelectInstances = () =>
  createSelector(
    selectDashboardViewImages,
    state => state.instances,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardViewImages,
    state => {
      const errors = [];
      if (state.instancesLoadingError) {
        errors.push(state.instancesLoadingError);
      }
      return errors;
    },
  );

export {
  selectDashboardViewImages,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectInstances,
};
