import {
  LOAD_INSTANCES,
  LOAD_INSTANCES_ERROR,
  LOAD_INSTANCES_SUCCESS,
} from './constants';
import { packError } from '../../utils/errors';

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
