import {
  SELECT_FILES,
  UPLOAD_OBJECTS,
  UPLOAD_OBJECTS_ERROR,
  UPLOAD_OBJECTS_SUCCESS,
} from './constants';
import { packError } from '../../utils/errors';

export function selectFiles(files) {
  return {
    type: SELECT_FILES,
    files,
  };
}

export function uploadObjects(arrayBuffers) {
  return {
    type: UPLOAD_OBJECTS,
    arrayBuffers,
  };
}

export function objectsUploaded(response) {
  return {
    type: UPLOAD_OBJECTS_SUCCESS,
    response,
  };
}

export function objectsUploadingError(error) {
  return {
    type: UPLOAD_OBJECTS_ERROR,
    error: packError(error),
  };
}
