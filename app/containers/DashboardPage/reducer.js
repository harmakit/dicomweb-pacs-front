import produce from 'immer';
import { OPEN_DRAWER, CLOSE_DRAWER } from './constants';

export const initialState = {
  isDrawerOpen: false,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case OPEN_DRAWER:
        draft.isDrawerOpen = true;
        break;
      case CLOSE_DRAWER:
        draft.isDrawerOpen = false;
        break;
    }
  });

export default dashboardReducer;
