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
import { packError } from '../../utils/errors';

export function loadSeries(seriesUID) {
  return {
    type: LOAD_SERIES,
    seriesUID,
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

export function loadInstances(options) {
  return {
    type: LOAD_INSTANCES,
    options,
  };
}

export function instancesLoaded(instances) {
  return {
    type: LOAD_INSTANCES_SUCCESS,
    instances,
  };
}

export function instancesLoadingError(error) {
  return {
    type: LOAD_INSTANCES_ERROR,
    error: packError(error),
  };
}

export function loadTotalInstancesCount(options) {
  return {
    type: LOAD_INSTANCES_TOTAL_COUNT,
    options,
  };
}

export function loadTotalInstancesCountLoaded(count) {
  return {
    type: LOAD_INSTANCES_TOTAL_COUNT_SUCCESS,
    count,
  };
}

export function loadTotalInstancesCountError(error) {
  return {
    type: LOAD_INSTANCES_TOTAL_COUNT_ERROR,
    error: packError(error),
  };
}
