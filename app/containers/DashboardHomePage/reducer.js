import produce from 'immer';
import {
  LOAD_SUMMARY_DATA,
  LOAD_SUMMARY_DATA_ERROR,
  LOAD_SUMMARY_DATA_SUCCESS,
} from './constants';

export const initialState = {
  summaryData: {},

  summaryDataLoading: false,

  summaryDataLoadingError: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_SUMMARY_DATA:
        draft.summaryDataLoading = true;
        draft.summaryDataLoadingError = false;
        break;
      case LOAD_SUMMARY_DATA_SUCCESS:
        draft.summaryData = action.summaryData;
        draft.summaryDataLoading = false;
        break;
      case LOAD_SUMMARY_DATA_ERROR:
        draft.summaryDataLoading = false;
        draft.summaryDataLoadingError = action.error;
        break;
    }
  });

export default reducer;
