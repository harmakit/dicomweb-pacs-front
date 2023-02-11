import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardInstance = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardInstance,
    state =>
      state.instanceObjectLoading ||
      state.toolsDataLoading ||
      state.toolsDataUpdating,
  );

const makeSelectInstanceObject = () =>
  createSelector(
    selectDashboardInstance,
    state => state.instanceObject,
  );
const makeSelectToolsData = () =>
  createSelector(
    selectDashboardInstance,
    state => state.toolsData,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardInstance,
    state => {
      const errors = [];
      if (state.instanceObjectLoadingError) {
        errors.push(state.instanceObjectLoadingError);
      }
      if (state.toolsDataLoadingError) {
        errors.push(state.toolsDataLoadingError);
      }
      if (state.toolsDataUpdatingError) {
        errors.push(state.toolsDataUpdatingError);
      }
      return errors;
    },
  );

export {
  selectDashboardInstance,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectInstanceObject,
  makeSelectToolsData,
};
