import {
  LOAD_INSTANCE_OBJECT,
  LOAD_INSTANCE_OBJECT_ERROR,
  LOAD_INSTANCE_OBJECT_SUCCESS,
  LOAD_TOOLS_DATA,
  LOAD_TOOLS_DATA_ERROR,
  LOAD_TOOLS_DATA_SUCCESS,
  UPDATE_TOOLS_DATA,
  UPDATE_TOOLS_DATA_ERROR,
  UPDATE_TOOLS_DATA_SUCCESS,
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

export function loadToolsData(instanceUID) {
  return {
    type: LOAD_TOOLS_DATA,
    instanceUID,
  };
}

export function toolsDataLoaded(toolsData) {
  return {
    type: LOAD_TOOLS_DATA_SUCCESS,
    toolsData,
  };
}

export function toolsDataLoadingError(error) {
  return {
    type: LOAD_TOOLS_DATA_ERROR,
    error: packError(error),
  };
}

export function updateToolsData(instanceUID, toolsData) {
  return {
    type: UPDATE_TOOLS_DATA,
    instanceUID,
    toolsData,
  };
}

export function toolsDataUpdated() {
  return {
    type: UPDATE_TOOLS_DATA_SUCCESS,
  };
}

export function toolsDataUpdatingError(error) {
  return {
    type: UPDATE_TOOLS_DATA_ERROR,
    error: packError(error),
  };
}
