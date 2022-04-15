import {call, put, takeLatest} from 'redux-saga/effects';
import ObjectsManager from '../../utils/objectsManager';
import {objectsUploaded, objectsUploadingError} from './actions';
import {UPLOAD_OBJECTS} from './constants';

export function* store({ objects }) {
  try {
    const uploaded = yield call(() => ObjectsManager.uploadObjects(objects));
    yield put(objectsUploaded(uploaded));
  } catch (err) {
    yield put(objectsUploadingError(err));
  }
}

export default function* data() {
  yield takeLatest(UPLOAD_OBJECTS, store);
}
