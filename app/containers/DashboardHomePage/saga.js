import { call, put, takeLatest } from 'redux-saga/effects';
import { summaryDataLoaded, summaryDataLoadingError } from './actions';
import { LOAD_SUMMARY_DATA } from './constants';
import ApiManager from '../../services/apiManager';

export function* getSummaryData() {
  try {
    const summaryData = yield call(() => ApiManager.loadSummaryData());
    yield put(summaryDataLoaded(summaryData));
  } catch (err) {
    yield put(summaryDataLoadingError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_SUMMARY_DATA, getSummaryData);
}
