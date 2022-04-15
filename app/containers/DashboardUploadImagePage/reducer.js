import produce from 'immer';
import {UPLOAD_OBJECTS, UPLOAD_OBJECTS_ERROR, UPLOAD_OBJECTS_SUCCESS,} from './constants';

export const initialState = {
  objectsUploading: false,

  objectsUploadingError: false,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardUploadImageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPLOAD_OBJECTS:
        draft.objectsUploading = true;
        draft.objectsUploadingError = false;
        break;
      case UPLOAD_OBJECTS_SUCCESS:
        draft.objectsUploading = false;
        break;
      case UPLOAD_OBJECTS_ERROR:
        draft.objectsUploading = false;
        draft.objectsUploadingError = action.error;
        break;
    }
  });

export default dashboardUploadImageReducer;
