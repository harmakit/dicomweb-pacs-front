import { call } from 'redux-saga/effects';
import DICOMwebClient from 'dicomweb-client/src/api';
import { isArray, merge } from 'lodash';
import Study, { FIELD_STUDY_INSTANCE_UID } from './dicom/parser/study';
import parser from './dicom/parser';

const BASE_URL = 'http://localhost:8042/dicom-web';
const client = new DICOMwebClient({ url: BASE_URL });

class ObjectsManager {
  studies = [];

  getStudy(studyUID) {
    const study = this.studies.find(
      item => item[FIELD_STUDY_INSTANCE_UID] === studyUID,
    );
    if (study) {
      return Promise.resolve(study);
    }
    const promise = client.searchForStudies({
      queryParams: {
        [Study.getFieldAttribute(FIELD_STUDY_INSTANCE_UID)]: studyUID,
      },
    });
    return promise.then(response => {
      const parsedStudies = response.map(studyData =>
        parser.parseStudy(studyData),
      );
      this.#cacheStudies(parsedStudies);
      if (parsedStudies.length === 0) {
        throw new Error();
      }
      return parsedStudies[0];
    });
  }

  #cacheStudies(records) {
    records.forEach(record => {
      let foundIndex = null;
      this.studies.find((study, index) => {
        if (
          record[FIELD_STUDY_INSTANCE_UID] === study[FIELD_STUDY_INSTANCE_UID]
        ) {
          this.studies[index] = merge(study, record);
          foundIndex = index;
        }
        return null;
      });
      if (foundIndex) {
        merge(this.studies[foundIndex], record);
      } else {
        this.studies.push(record);
      }
    });
  }

  /**
   * @param {Object} options
   * @param cache
   * @param {Object} [options.queryParams]
   */
  searchStudies(options = {}, cache = false) {
    return call(() => {
      const promise = client.searchForStudies(options);
      return promise.then(response => {
        const parsedStudies = response.map(studyData =>
          parser.parseStudy(studyData),
        );
        if (cache) {
          this.#cacheStudies(parsedStudies);
        }
        return parsedStudies;
      });
    });
  }

  /**
   * @param {Object} options
   * @param {Object} [options.queryParams]
   */
  searchSeries(options = {}) {
    return call(() => client.searchForSeries(options));
  }
}

const manager = new ObjectsManager();
export default manager;
