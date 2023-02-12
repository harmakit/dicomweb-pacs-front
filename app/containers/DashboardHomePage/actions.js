import {
  LOAD_SUMMARY_DATA,
  LOAD_SUMMARY_DATA_ERROR,
  LOAD_SUMMARY_DATA_SUCCESS,
} from './constants';
import { packError } from '../../utils/errors';

export function loadSummaryData() {
  return {
    type: LOAD_SUMMARY_DATA,
  };
}

export function summaryDataLoaded(summaryData) {
  return {
    type: LOAD_SUMMARY_DATA_SUCCESS,
    summaryData,
  };
}

export function summaryDataLoadingError(error) {
  return {
    type: LOAD_SUMMARY_DATA_ERROR,
    error: packError(error),
  };
}
