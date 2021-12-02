import { call } from 'redux-saga/effects';
import DICOMwebClient from 'dicomweb-client/src/api';

const BASE_URL = 'http://localhost:8042/dicom-web';
const client = new DICOMwebClient({ url: BASE_URL });
/**
 * @param {Object} options
 * @param {Object} [options.queryParams]
 */
export function studiesCall(options = {}) {
  return call(() => client.searchForStudies(options));
}
