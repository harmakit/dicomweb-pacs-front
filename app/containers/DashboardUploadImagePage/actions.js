import {UPLOAD_OBJECTS, UPLOAD_OBJECTS_ERROR, UPLOAD_OBJECTS_SUCCESS,} from './constants';
import {packError} from '../../utils/errors';

export function uploadObjects(objects) {
  return {
    type: UPLOAD_OBJECTS,
    objects,
  };
}

export function objectsUploaded() {
  return {
    type: UPLOAD_OBJECTS_SUCCESS,
  };
}

export function objectsUploadingError(error) {
  return {
    type: UPLOAD_OBJECTS_ERROR,
    error: packError(error),
  };
}
