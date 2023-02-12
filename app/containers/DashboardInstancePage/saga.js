import { call, put, takeLatest } from 'redux-saga/effects';
import {
  clearToolsData,
  instanceObjectLoaded,
  instanceObjectLoadingError,
  toolsDataLoaded,
  toolsDataLoadingError,
  toolsDataUpdated,
  toolsDataUpdatingError,
} from './actions';
import {
  LOAD_INSTANCE_OBJECT,
  LOAD_TOOLS_DATA,
  UPDATE_TOOLS_DATA,
} from './constants';
import ObjectsManager from '../../services/objectsManager';
import Instance from '../../services/dicom/parser/instance';
import ApiManager from '../../services/apiManager';

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

export function* loadToolsData({ instanceUID }) {
  try {
    yield put(clearToolsData());
    const toolsData = yield call(() => ApiManager.loadToolsData(instanceUID));
    yield put(toolsDataLoaded(toolsData));
  } catch (err) {
    yield put(toolsDataLoadingError(err));
  }
}

export function* updateToolsData({ instanceUID, toolsData }) {
  try {
    const updatedToolsData = yield call(() =>
      ApiManager.updateToolsData(instanceUID, toolsData),
    );
    yield put(toolsDataUpdated(updatedToolsData));
  } catch (err) {
    yield put(toolsDataUpdatingError(err));
  }
}

export default function* data() {
  yield takeLatest(LOAD_INSTANCE_OBJECT, getInstanceObject);
  yield takeLatest(LOAD_TOOLS_DATA, loadToolsData);
  yield takeLatest(UPDATE_TOOLS_DATA, updateToolsData);
}
