import produce from 'immer';
import {
  LOAD_STUDIES,
  LOAD_STUDIES_ERROR,
  LOAD_STUDIES_SUCCESS,
  LOAD_STUDIES_TOTAL_COUNT,
  LOAD_STUDIES_TOTAL_COUNT_ERROR,
  LOAD_STUDIES_TOTAL_COUNT_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  totalCountLoading: false,

  error: false,
  studiesTotalError: false,

  studies: [],
  studiesTotalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardStudiesReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_STUDIES:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_STUDIES_SUCCESS:
        draft.studies = action.studies;
        draft.loading = false;
        break;
      case LOAD_STUDIES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case LOAD_STUDIES_TOTAL_COUNT:
        draft.totalCountLoading = true;
        draft.studiesTotalError = false;
        break;
      case LOAD_STUDIES_TOTAL_COUNT_SUCCESS:
        draft.studiesTotalCount = action.count;
        draft.totalCountLoading = false;
        break;
      case LOAD_STUDIES_TOTAL_COUNT_ERROR:
        draft.studiesTotalError = action.error;
        draft.totalCountLoading = false;
        break;
    }
  });

export default dashboardStudiesReducer;
