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
  studiesLoading: false,
  studiesTotalCountLoading: false,

  studiesLoadingError: false,
  studiesTotalCountError: false,

  studies: [],
  studiesTotalCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_STUDIES:
        draft.studiesLoading = true;
        draft.studiesLoadingError = false;
        break;
      case LOAD_STUDIES_SUCCESS:
        draft.studies = action.studies;
        draft.studiesLoading = false;
        break;
      case LOAD_STUDIES_ERROR:
        draft.studiesLoadingError = action.error;
        draft.studiesLoading = false;
        break;
      case LOAD_STUDIES_TOTAL_COUNT:
        draft.studiesTotalCountLoading = true;
        draft.studiesTotalCountError = false;
        break;
      case LOAD_STUDIES_TOTAL_COUNT_SUCCESS:
        draft.studiesTotalCount = action.count;
        draft.studiesTotalCountLoading = false;
        break;
      case LOAD_STUDIES_TOTAL_COUNT_ERROR:
        draft.studiesTotalCountError = action.error;
        draft.studiesTotalCountLoading = false;
        break;
    }
  });

export default reducer;
