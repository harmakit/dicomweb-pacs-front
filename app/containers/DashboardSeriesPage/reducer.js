import produce from 'immer';
import {
  LOAD_INSTANCES,
  LOAD_INSTANCES_ERROR,
  LOAD_INSTANCES_SUCCESS,
  LOAD_INSTANCES_TOTAL_COUNT,
  LOAD_INSTANCES_TOTAL_COUNT_ERROR,
  LOAD_INSTANCES_TOTAL_COUNT_SUCCESS,
  LOAD_SERIES,
  LOAD_SERIES_ERROR,
  LOAD_SERIES_SUCCESS,
} from './constants';

export const initialState = {
  seriesLoading: false,
  loading: false,
  totalCountLoading: false,

  seriesLoadingError: false,
  error: false,
  instancesTotalError: false,

  series: null,
  instances: [],
  instancesTotalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardSeriesReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_SERIES:
        draft.seriesLoading = true;
        draft.seriesLoadingError = false;
        break;
      case LOAD_SERIES_SUCCESS:
        draft.seriesLoading = false;
        draft.series = action.series;
        break;
      case LOAD_SERIES_ERROR:
        draft.seriesLoading = false;
        draft.seriesLoadingError = action.error;
        break;
      case LOAD_INSTANCES:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_INSTANCES_SUCCESS:
        draft.instances = action.instances;
        draft.loading = false;
        break;
      case LOAD_INSTANCES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case LOAD_INSTANCES_TOTAL_COUNT:
        draft.totalCountLoading = true;
        draft.instancesTotalError = false;
        break;
      case LOAD_INSTANCES_TOTAL_COUNT_SUCCESS:
        draft.instancesTotalCount = action.count;
        draft.totalCountLoading = false;
        break;
      case LOAD_INSTANCES_TOTAL_COUNT_ERROR:
        draft.instancesTotalError = action.error;
        draft.totalCountLoading = false;
        break;
    }
  });

export default dashboardSeriesReducer;
