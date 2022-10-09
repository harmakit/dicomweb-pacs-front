import produce from 'immer';
import {
  LOAD_INSTANCES,
  LOAD_INSTANCES_ERROR,
  LOAD_INSTANCES_SUCCESS,
  LOAD_INSTANCES_TOTAL_COUNT,
  LOAD_INSTANCES_TOTAL_COUNT_ERROR,
  LOAD_INSTANCES_TOTAL_COUNT_SUCCESS,
  LOAD_SERIES_OBJECT,
  LOAD_SERIES_OBJECT_ERROR,
  LOAD_SERIES_OBJECT_SUCCESS,
} from './constants';

export const initialState = {
  seriesObjectLoading: false,
  instancesLoading: false,
  instancesTotalCountLoading: false,

  seriesObjectLoadingError: false,
  instancesLoadingError: false,
  instancesTotalCountError: false,

  seriesObject: null,
  instances: [],
  instancesTotalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_SERIES_OBJECT:
        draft.seriesObjectLoading = true;
        draft.seriesObjectLoadingError = false;
        break;
      case LOAD_SERIES_OBJECT_SUCCESS:
        draft.seriesObjectLoading = false;
        draft.seriesObject = action.series;
        break;
      case LOAD_SERIES_OBJECT_ERROR:
        draft.seriesObjectLoading = false;
        draft.seriesObjectLoadingError = action.error;
        break;
      case LOAD_INSTANCES:
        draft.instancesLoading = true;
        draft.instancesLoadingError = false;
        break;
      case LOAD_INSTANCES_SUCCESS:
        draft.instances = action.instances;
        draft.instancesLoading = false;
        break;
      case LOAD_INSTANCES_ERROR:
        draft.instancesLoadingError = action.error;
        draft.instancesLoading = false;
        break;
      case LOAD_INSTANCES_TOTAL_COUNT:
        draft.instancesTotalCountLoading = true;
        draft.instancesTotalCountError = false;
        break;
      case LOAD_INSTANCES_TOTAL_COUNT_SUCCESS:
        draft.instancesTotalCount = action.count;
        draft.instancesTotalCountLoading = false;
        break;
      case LOAD_INSTANCES_TOTAL_COUNT_ERROR:
        draft.instancesTotalCountError = action.error;
        draft.instancesTotalCountLoading = false;
        break;
    }
  });

export default reducer;
