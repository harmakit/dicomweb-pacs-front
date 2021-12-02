import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectDashboard = state => state.dashboard || initialState;

const makeSelectIsDrawerOpen = () =>
  createSelector(
    selectDashboard,
    state => state.isDrawerOpen,
  );

export { selectDashboard, makeSelectIsDrawerOpen };
