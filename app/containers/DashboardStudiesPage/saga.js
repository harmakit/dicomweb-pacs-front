import { put, takeLatest } from 'redux-saga/effects';
import {
  loadTotalStudiesCountError,
  loadTotalStudiesCountLoaded,
  studiesLoaded,
  studiesLoadingError,
} from './actions';
import { LOAD_STUDIES, LOAD_STUDIES_TOTAL_COUNT } from './constants';
import ObjectsManager from '../../utils/objectsManager';
import parser from '../../utils/dicom/parser';

export function* getStudies({ options }) {
  try {
    const studies = yield ObjectsManager.searchStudies(options, true);
    if (!Array.isArray(studies)) {
      throw new Error('Wrong server response');
    }
    yield put(studiesLoaded(studies));
  } catch (err) {
    yield put(studiesLoadingError(err));
  }
}
export function* getStudiesCount({ options }) {
  try {
    const studies = yield ObjectsManager.searchStudies(options);
    if (!Array.isArray(studies)) {
      throw new Error('Wrong server response');
    }
    yield put(loadTotalStudiesCountLoaded(studies.length));
  } catch (err) {
    yield put(loadTotalStudiesCountError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_STUDIES, getStudies);
  yield takeLatest(LOAD_STUDIES_TOTAL_COUNT, getStudiesCount);
}
