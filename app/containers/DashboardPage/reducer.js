import produce from 'immer';
import {CLOSE_DRAWER, OPEN_DRAWER} from './constants';

export const initialState = {
  isDrawerOpen: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
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

export default reducer;
