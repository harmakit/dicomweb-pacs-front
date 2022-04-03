import { call, put, takeLatest } from 'redux-saga/effects';
import { instanceObjectLoaded, instanceObjectLoadingError } from './actions';
import { LOAD_INSTANCE_OBJECT } from './constants';
import ObjectsManager from '../../utils/objectsManager';
import Instance from '../../utils/dicom/parser/instance';

export function* getInstanceObject({ instanceUID }) {
  try {
    const instance = yield call(() =>
      ObjectsManager.getObjectById(Instance, instanceUID),
    );
    if (!(instance instanceof Instance)) {
      throw new Error('Wrong instance response');
    }
    yield put(instanceObjectLoaded(instance));
  } catch (err) {
    yield put(instanceObjectLoadingError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_INSTANCE_OBJECT, getInstanceObject);
}
