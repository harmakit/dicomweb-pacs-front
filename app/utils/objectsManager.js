import DICOMwebClient from 'dicomweb-client/src/api';
import { merge } from 'lodash';
import parser from './dicom/parser';
import Study from './dicom/parser/study';
import Series from './dicom/parser/series';

const BASE_URL = 'http://localhost:8042/dicom-web';
const client = new DICOMwebClient({ url: BASE_URL });

class ObjectsManager {
  #cache = new Map([[Study, []], [Series, []]]);

  #cacheObjects(objects) {
    objects.forEach(object => {
      if (!this.#cache.has(object.constructor.name)) {
        return;
      }

      let foundIndex = null;
      const cachedObjects = this.#cache.get(object.constructor.name);
      cachedObjects.find((cachedObject, index) => {
        if (
          object[object.getObjectIdField()] ===
          cachedObject[object.getObjectIdField()]
        ) {
          cachedObjects[index] = merge(cachedObject, object);
          foundIndex = index;
        }
        return null;
      });

      if (foundIndex) {
        merge(cachedObjects[foundIndex], object);
      } else {
        cachedObjects.push(object);
      }

      this.#cache.set(object.constructor.name, cachedObjects);
    });
  }

  getStudy(studyUID) {
    const study = this.#cache
      .get(Study)
      .find(item => item[Study.getObjectIdField()] === studyUID);
    if (study) {
      return Promise.resolve(study);
    }
    const promise = client.searchForStudies({
      queryParams: {
        [Study.getFieldAttribute(Study.getObjectIdField())]: studyUID,
      },
    });
    return promise.then(response => {
      const parsedStudies = response.map(studyData =>
        parser.parseStudy(studyData),
      );
      this.#cacheObjects(parsedStudies);
      if (parsedStudies.length === 0) {
        throw new Error();
      }
      return parsedStudies[0];
    });
  }

  /**
   * @param {Object} options
   * @param cache
   * @param {Object} [options.queryParams]
   */
  searchStudies(options = {}, cache = false) {
    const promise = client.searchForStudies(options);
    return promise.then(response => {
      const parsedStudies = response.map(studyData =>
        parser.parseStudy(studyData),
      );
      if (cache) {
        this.#cacheObjects(parsedStudies);
      }
      return parsedStudies;
    });
  }

  /**
   * @param {Object} options
   * @param cache
   * @param {Object} [options.queryParams]
   */
  searchSeries(options = {}, cache = false) {
    const promise = client.searchForSeries(options);
    return promise.then(response => {
      const parsedSeries = response.map(seriesData =>
        parser.parseSeries(seriesData),
      );
      if (cache) {
        this.#cacheObjects(parsedSeries);
      }
      return parsedSeries;
    });
  }
}

const manager = new ObjectsManager();
export default manager;
