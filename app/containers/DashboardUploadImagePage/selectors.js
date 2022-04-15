import {createSelector} from 'reselect';
import {initialState} from './reducer';
import {key} from './key';

const selectDashboardUploadImages = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardUploadImages,
    state => state.objectsUploading,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardUploadImages,
    state => {
      const errors = [];
      if (state.objectsUploadingError) {
        errors.push(state.objectsUploadingError);
      }
      return errors;
    },
  );

export { selectDashboardUploadImages, makeSelectLoading, makeSelectErrors };
