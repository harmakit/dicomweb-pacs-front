import { put, takeLatest } from 'redux-saga/effects';
import {
  loadTotalSeriesCountError,
  loadTotalSeriesCountLoaded,
  seriesLoaded,
  seriesLoadingError,
} from './actions';
import { LOAD_SERIES, LOAD_SERIES_TOTAL_COUNT } from './constants';
import ObjectsManager from '../../utils/objectsManager';
import parser from '../../utils/dicom/parser';

export function* getSeries({ options }) {
  try {
    const series = yield ObjectsManager.searchSeries(options, true);
    if (!Array.isArray(series)) {
      throw new Error('Wrong server response');
    }
    const parsedSeries = series.map(studyData => parser.parseStudy(studyData));
    yield put(seriesLoaded(parsedSeries));
  } catch (err) {
    yield put(seriesLoadingError(err));
  }
}
export function* getSeriesCount({ options }) {
  try {
    const series = yield ObjectsManager.searchSeries(options);
    if (!Array.isArray(series)) {
      throw new Error('Wrong server response');
    }
    const parsedSeries = series.map(studyData => parser.parseStudy(studyData));
    yield put(loadTotalSeriesCountLoaded(parsedSeries.length));
  } catch (err) {
    yield put(loadTotalSeriesCountError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_SERIES, getSeries);
  yield takeLatest(LOAD_SERIES_TOTAL_COUNT, getSeriesCount);
}
