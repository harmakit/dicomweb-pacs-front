import {
  LOAD_INSTANCE_OBJECT,
  LOAD_INSTANCE_OBJECT_ERROR,
  LOAD_INSTANCE_OBJECT_SUCCESS,
} from './constants';
import { packError } from '../../utils/errors';

export function loadInstanceObject(instanceUID) {
  return {
    type: LOAD_INSTANCE_OBJECT,
    instanceUID,
  };
}

export function instanceObjectLoaded(instance) {
  return {
    type: LOAD_INSTANCE_OBJECT_SUCCESS,
    instance,
  };
}

export function instanceObjectLoadingError(error) {
  return {
    type: LOAD_INSTANCE_OBJECT_ERROR,
    error: packError(error),
  };
}
