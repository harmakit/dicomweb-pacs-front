import produce from 'immer';
import {
  LOAD_INSTANCES,
  LOAD_INSTANCES_ERROR,
  LOAD_INSTANCES_SUCCESS,
} from './constants';

export const initialState = {
  instancesLoading: false,

  instancesLoadingError: false,

  instances: [],
};

/* eslint-disable default-case, no-param-reassign */
const dashboardInstanceReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_INSTANCES:
        draft.instancesLoading = true;
        draft.instancesLoadingError = false;
        break;
      case LOAD_INSTANCES_SUCCESS:
        draft.instancesLoading = false;
        draft.instances = action.instances;
        break;
      case LOAD_INSTANCES_ERROR:
        draft.instancesLoading = false;
        draft.instancesLoadingError = action.error;
        break;
    }
  });

export default dashboardInstanceReducer;
