import produce from 'immer';
import {
  LOAD_SERIES,
  LOAD_SERIES_ERROR,
  LOAD_SERIES_SUCCESS,
  LOAD_SERIES_TOTAL_COUNT,
  LOAD_SERIES_TOTAL_COUNT_ERROR,
  LOAD_SERIES_TOTAL_COUNT_SUCCESS,
  LOAD_STUDY_OBJECT,
  LOAD_STUDY_OBJECT_ERROR,
  LOAD_STUDY_OBJECT_SUCCESS,
} from './constants';

export const initialState = {
  studyObjectLoading: false,
  seriesLoading: false,
  seriesTotalCountLoading: false,

  studyObjectLoadingError: false,
  seriesLoadingError: false,
  seriesTotalCountError: false,

  studyObject: null,
  series: [],
  seriesTotalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_STUDY_OBJECT:
        draft.studyObjectLoading = true;
        draft.studyObjectLoadingError = false;
        break;
      case LOAD_STUDY_OBJECT_SUCCESS:
        draft.studyObjectLoading = false;
        draft.studyObject = action.study;
        break;
      case LOAD_STUDY_OBJECT_ERROR:
        draft.studyObjectLoading = false;
        draft.studyObjectLoadingError = action.error;
        break;
      case LOAD_SERIES:
        draft.seriesLoading = true;
        draft.seriesLoadingError = false;
        break;
      case LOAD_SERIES_SUCCESS:
        draft.series = action.series;
        draft.seriesLoading = false;
        break;
      case LOAD_SERIES_ERROR:
        draft.seriesLoadingError = action.error;
        draft.seriesLoading = false;
        break;
      case LOAD_SERIES_TOTAL_COUNT:
        draft.seriesTotalCountLoading = true;
        draft.seriesTotalCountError = false;
        break;
      case LOAD_SERIES_TOTAL_COUNT_SUCCESS:
        draft.seriesTotalCount = action.count;
        draft.seriesTotalCountLoading = false;
        break;
      case LOAD_SERIES_TOTAL_COUNT_ERROR:
        draft.seriesTotalCountError = action.error;
        draft.seriesTotalCountLoading = false;
        break;
    }
  });

export default reducer;
