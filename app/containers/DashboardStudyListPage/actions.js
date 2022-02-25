import {
  LOAD_STUDIES,
  LOAD_STUDIES_ERROR,
  LOAD_STUDIES_SUCCESS,
  LOAD_STUDIES_TOTAL_COUNT,
  LOAD_STUDIES_TOTAL_COUNT_ERROR,
  LOAD_STUDIES_TOTAL_COUNT_SUCCESS,
} from './constants';
import { packError } from '../../utils/errors';

export function loadStudies(options) {
  return {
    type: LOAD_STUDIES,
    options,
  };
}

export function studiesLoaded(studies) {
  return {
    type: LOAD_STUDIES_SUCCESS,
    studies,
  };
}

export function studiesLoadingError(error) {
  return {
    type: LOAD_STUDIES_ERROR,
    error: packError(error),
  };
}

export function loadTotalStudiesCount(options) {
  return {
    type: LOAD_STUDIES_TOTAL_COUNT,
    options,
  };
}

export function loadTotalStudiesCountLoaded(count) {
  return {
    type: LOAD_STUDIES_TOTAL_COUNT_SUCCESS,
    count,
  };
}

export function loadTotalStudiesCountError(error) {
  return {
    type: LOAD_STUDIES_TOTAL_COUNT_ERROR,
    error: packError(error),
  };
}
