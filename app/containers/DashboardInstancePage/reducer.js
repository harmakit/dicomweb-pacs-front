import produce from 'immer';
import {
  LOAD_INSTANCE_OBJECT,
  LOAD_INSTANCE_OBJECT_ERROR,
  LOAD_INSTANCE_OBJECT_SUCCESS,
} from './constants';

export const initialState = {
  instanceObjectLoading: false,

  instanceObjectLoadingError: false,

  instanceObject: null,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_INSTANCE_OBJECT:
        draft.instanceObjectLoading = true;
        draft.instanceObjectLoadingError = false;
        break;
      case LOAD_INSTANCE_OBJECT_SUCCESS:
        draft.instanceObjectLoading = false;
        draft.instanceObject = action.instance;
        break;
      case LOAD_INSTANCE_OBJECT_ERROR:
        draft.instanceObjectLoading = false;
        draft.instanceObjectLoadingError = action.error;
        break;
    }
  });

export default reducer;
