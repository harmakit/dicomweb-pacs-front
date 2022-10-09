import { call, put, takeLatest } from 'redux-saga/effects';
import {
  instancesLoaded,
  instancesLoadingError,
  loadTotalInstancesCountError,
  loadTotalInstancesCountLoaded,
  seriesObjectLoaded,
  seriesObjectLoadingError,
} from './actions';
import {
  LOAD_INSTANCES,
  LOAD_INSTANCES_TOTAL_COUNT,
  LOAD_SERIES_OBJECT,
} from './constants';
import ObjectsManager from '../../utils/objectsManager';
import Series from '../../utils/dicom/parser/series';
import Instance from '../../utils/dicom/parser/instance';

export function* getSeriesObject({ seriesUID }) {
  try {
    const series = yield call(() =>
      ObjectsManager.getObjectById(Series, seriesUID),
    );
    if (!(series instanceof Series)) {
      throw new Error('Wrong series response');
    }
    yield put(seriesObjectLoaded(series));
  } catch (err) {
    yield put(seriesObjectLoadingError(err));
  }
}

export function* getInstances({ options }) {
  try {
    const instances = yield call(() =>
      ObjectsManager.searchObjects(Instance, options, true),
    );
    if (!Array.isArray(instances)) {
      throw new Error('Wrong server response');
    }
    yield put(instancesLoaded(instances));
  } catch (err) {
    yield put(instancesLoadingError(err));
  }
}

export function* getInstancesCount({ options }) {
  try {
    const instances = yield call(() =>
      ObjectsManager.searchObjects(Instance, options),
    );
    if (!Array.isArray(instances)) {
      throw new Error('Wrong server response');
    }
    yield put(loadTotalInstancesCountLoaded(instances.length));
  } catch (err) {
    yield put(loadTotalInstancesCountError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_SERIES_OBJECT, getSeriesObject);
  yield takeLatest(LOAD_INSTANCES, getInstances);
  yield takeLatest(LOAD_INSTANCES_TOTAL_COUNT, getInstancesCount);
}
