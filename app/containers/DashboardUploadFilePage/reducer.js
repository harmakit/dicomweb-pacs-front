import produce from 'immer';
import {
  SELECT_FILES,
  UPLOAD_OBJECTS,
  UPLOAD_OBJECTS_ERROR,
  UPLOAD_OBJECTS_SUCCESS,
} from './constants';

export const initialState = {
  files: [],

  objectsUploading: false,

  objectsUploadingResponse: null,

  objectsUploadingError: false,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardUploadFileReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SELECT_FILES:
        draft.files = action.files;
        draft.objectsUploadingResponse = null;
        draft.objectsUploadingError = false;
        break;
      case UPLOAD_OBJECTS:
        draft.objectsUploading = true;
        draft.objectsUploadingError = false;
        draft.objectsUploadingResponse = null;
        break;
      case UPLOAD_OBJECTS_SUCCESS:
        draft.objectsUploadingResponse = action.response;
        draft.objectsUploading = false;
        break;
      case UPLOAD_OBJECTS_ERROR:
        draft.objectsUploading = false;
        draft.objectsUploadingError = action.error;
        draft.objectsUploadingResponse = null;
        break;
    }
  });

export default dashboardUploadFileReducer;
