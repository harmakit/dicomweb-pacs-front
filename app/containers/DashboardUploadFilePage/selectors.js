import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { key } from './key';

const selectDashboardUploadFile = state => state[key] || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectDashboardUploadFile,
    state => state.objectsUploading,
  );

const makeSelectResponse = () =>
  createSelector(
    selectDashboardUploadFile,
    state => state.objectsUploadingResponse,
  );

const makeSelectFiles = () =>
  createSelector(
    selectDashboardUploadFile,
    state => state.files,
  );

const makeSelectErrors = () =>
  createSelector(
    selectDashboardUploadFile,
    state => {
      const errors = [];
      if (state.objectsUploadingError) {
        errors.push(state.objectsUploadingError);
      }
      return errors;
    },
  );

export {
  selectDashboardUploadFile,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectResponse,
  makeSelectFiles,
};
