import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loadTotalSeriesCountError,
  loadTotalSeriesCountLoaded,
  seriesLoaded,
  seriesLoadingError,
  studyObjectLoaded,
} from './actions';
import {
  LOAD_SERIES,
  LOAD_SERIES_TOTAL_COUNT,
  LOAD_STUDY_OBJECT,
} from './constants';
import ObjectsManager from '../../service/objectsManager';
import Study from '../../service/dicom/parser/study';
import Series from '../../service/dicom/parser/series';

export function* getStudyObject({ studyUID }) {
  try {
    const study = yield call(() =>
      ObjectsManager.getObjectById(Study, studyUID),
    );
    if (!(study instanceof Study)) {
      throw new Error('Wrong study response');
    }
    yield put(studyObjectLoaded(study));
  } catch (err) {
    yield put(seriesLoadingError(err));
  }
}

export function* getSeries({ options }) {
  try {
    const series = yield call(() =>
      ObjectsManager.searchObjects(Series, options, true),
    );
    if (!Array.isArray(series)) {
      throw new Error('Wrong server response');
    }
    yield put(seriesLoaded(series));
  } catch (err) {
    yield put(seriesLoadingError(err));
  }
}

export function* getSeriesCount({ options }) {
  try {
    const series = yield call(() =>
      ObjectsManager.searchObjects(Series, options),
    );
    if (!Array.isArray(series)) {
      throw new Error('Wrong server response');
    }
    yield put(loadTotalSeriesCountLoaded(series.length));
  } catch (err) {
    yield put(loadTotalSeriesCountError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_STUDY_OBJECT, getStudyObject);
  yield takeLatest(LOAD_SERIES, getSeries);
  yield takeLatest(LOAD_SERIES_TOTAL_COUNT, getSeriesCount);
}
