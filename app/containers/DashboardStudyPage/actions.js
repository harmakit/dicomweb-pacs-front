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
import { packError } from '../../utils/errors';

export function loadStudyObject(studyUID) {
  return {
    type: LOAD_STUDY_OBJECT,
    studyUID,
  };
}

export function studyObjectLoaded(study) {
  return {
    type: LOAD_STUDY_OBJECT_SUCCESS,
    study,
  };
}

export function studyObjectLoadingError(error) {
  return {
    type: LOAD_STUDY_OBJECT_ERROR,
    error: packError(error),
  };
}

export function loadSeries(options) {
  return {
    type: LOAD_SERIES,
    options,
  };
}

export function seriesLoaded(series) {
  return {
    type: LOAD_SERIES_SUCCESS,
    series,
  };
}

export function seriesLoadingError(error) {
  return {
    type: LOAD_SERIES_ERROR,
    error: packError(error),
  };
}

export function loadTotalSeriesCount(options) {
  return {
    type: LOAD_SERIES_TOTAL_COUNT,
    options,
  };
}

export function loadTotalSeriesCountLoaded(count) {
  return {
    type: LOAD_SERIES_TOTAL_COUNT_SUCCESS,
    count,
  };
}

export function loadTotalSeriesCountError(error) {
  return {
    type: LOAD_SERIES_TOTAL_COUNT_ERROR,
    error: packError(error),
  };
}
