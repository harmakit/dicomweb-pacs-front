import produce from 'immer';
import {
  LOAD_SERIES,
  LOAD_SERIES_ERROR,
  LOAD_SERIES_SUCCESS,
  LOAD_SERIES_TOTAL_COUNT,
  LOAD_SERIES_TOTAL_COUNT_ERROR,
  LOAD_SERIES_TOTAL_COUNT_SUCCESS,
  LOAD_STUDY,
  LOAD_STUDY_ERROR,
  LOAD_STUDY_SUCCESS,
} from './constants';

export const initialState = {
  studyLoading: false,
  loading: false,
  totalCountLoading: false,

  studyLoadingError: false,
  error: false,
  seriesTotalError: false,

  study: null,
  series: [],
  seriesTotalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardSeriesReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_STUDY:
        draft.studyLoading = true;
        draft.studyLoadingError = false;
        break;
      case LOAD_STUDY_SUCCESS:
        draft.studyLoading = false;
        draft.study = action.study;
        break;
      case LOAD_STUDY_ERROR:
        draft.studyLoading = false;
        draft.studyLoadingError = action.error;
        break;
      case LOAD_SERIES:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_SERIES_SUCCESS:
        draft.series = action.series;
        draft.loading = false;
        break;
      case LOAD_SERIES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case LOAD_SERIES_TOTAL_COUNT:
        draft.totalCountLoading = true;
        draft.seriesTotalError = false;
        break;
      case LOAD_SERIES_TOTAL_COUNT_SUCCESS:
        draft.seriesTotalCount = action.count;
        draft.totalCountLoading = false;
        break;
      case LOAD_SERIES_TOTAL_COUNT_ERROR:
        draft.seriesTotalError = action.error;
        draft.totalCountLoading = false;
        break;
    }
  });

export default dashboardSeriesReducer;
