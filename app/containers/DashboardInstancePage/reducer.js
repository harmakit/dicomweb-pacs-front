import produce from 'immer';
import {
  CLEAR_TOOLS_DATA,
  LOAD_INSTANCE_OBJECT,
  LOAD_INSTANCE_OBJECT_ERROR,
  LOAD_INSTANCE_OBJECT_SUCCESS,
  LOAD_TOOLS_DATA,
  LOAD_TOOLS_DATA_ERROR,
  LOAD_TOOLS_DATA_SUCCESS,
  UPDATE_TOOLS_DATA,
  UPDATE_TOOLS_DATA_ERROR,
  UPDATE_TOOLS_DATA_SUCCESS,
} from './constants';

export const initialState = {
  instanceObjectLoading: false,

  instanceObjectLoadingError: false,

  instanceObject: null,

  toolsData: null,

  toolsDataLoading: false,

  toolsDataLoadingError: false,

  toolsDataUpdating: false,

  toolsDataUpdatingError: false,
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
      case LOAD_TOOLS_DATA:
        draft.toolsDataLoading = true;
        draft.toolsDataLoadingError = false;
        break;
      case CLEAR_TOOLS_DATA:
        draft.toolsData = null;
        break;
      case LOAD_TOOLS_DATA_SUCCESS:
        draft.toolsDataLoading = false;
        draft.toolsData = action.toolsData;
        break;
      case LOAD_TOOLS_DATA_ERROR:
        draft.toolsDataLoading = false;
        draft.toolsDataLoadingError = action.error;
        break;
      case UPDATE_TOOLS_DATA:
        draft.toolsDataUpdating = true;
        draft.toolsDataUpdatingError = false;
        break;
      case UPDATE_TOOLS_DATA_SUCCESS:
        draft.toolsDataUpdating = false;
        break;
      case UPDATE_TOOLS_DATA_ERROR:
        draft.toolsDataUpdating = false;
        draft.toolsDataUpdatingError = action.error;
        break;
    }
  });

export default reducer;
