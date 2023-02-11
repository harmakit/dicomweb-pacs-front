import { call, put, takeLatest } from 'redux-saga/effects';
import ObjectsManager from '../../service/objectsManager';
import Instance from '../../service/dicom/parser/instance';
import { instancesLoaded, instancesLoadingError } from './actions';
import { LOAD_INSTANCES } from './constants';

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

export default function* data() {
  yield takeLatest(LOAD_INSTANCES, getInstances);
}
