import {
  LOAD_INSTANCES,
  LOAD_INSTANCES_ERROR,
  LOAD_INSTANCES_SUCCESS,
  LOAD_INSTANCES_TOTAL_COUNT,
  LOAD_INSTANCES_TOTAL_COUNT_ERROR,
  LOAD_INSTANCES_TOTAL_COUNT_SUCCESS,
  LOAD_SERIES_OBJECT,
  LOAD_SERIES_OBJECT_ERROR,
  LOAD_SERIES_OBJECT_SUCCESS,
} from './constants';
import { packError } from '../../utils/errors';

export function loadSeriesObject(seriesUID) {
  return {
    type: LOAD_SERIES_OBJECT,
    seriesUID,
  };
}

export function seriesObjectLoaded(series) {
  return {
    type: LOAD_SERIES_OBJECT_SUCCESS,
    series,
  };
}

export function seriesObjectLoadingError(error) {
  return {
    type: LOAD_SERIES_OBJECT_ERROR,
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
