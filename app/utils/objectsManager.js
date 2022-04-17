import DICOMwebClient from 'dicomweb-client/src/api';
import {merge} from 'lodash';
import parser from './dicom/parser';
import Study from './dicom/parser/study';
import Series from './dicom/parser/series';
import Instance from './dicom/parser/instance';
import config from '../params';
import STOWResponse from './dicom/parser/stowResponse';

const client = new DICOMwebClient({
  url: config.wadoURL,
});

class ObjectsManager {
  #cache = new Map([[Study, []], [Series, []], [Instance, []]]);

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

  getObjectById(objectType, objectId) {
    const object = this.#cache
      .get(objectType)
      .find(item => item[objectType.getObjectIdField()] === objectId);
    if (object) {
      return Promise.resolve(object);
    }
    const options = {
      queryParams: {
        [objectType.getFieldAttribute(objectType.getObjectIdField())]: objectId,
      },
    };
    const promise = this.searchObjects(objectType, options, true);
    return promise.then(objects => {
      if (objects.length === 0) {
        return null;
      }
      return objects[0];
    });
  }

  /**
   * @param objectType
   * @param {Object} options
   * @param cache
   * @param {Object} [options.queryParams]
   */
  searchObjects(objectType, options = {}, cache = false) {
    let searchMethod = null;
    switch (objectType) {
      case Study:
        searchMethod = args => client.searchForStudies(args);
        break;
      case Series:
        searchMethod = args => client.searchForSeries(args);
        break;
      case Instance:
        searchMethod = args => client.searchForInstances(args);
        break;
      default:
        throw new TypeError(`Wrong type "${objectType}"`);
    }
    const promise = searchMethod(options);
    return promise.then(response => {
      const parsed = response.map(data => parser.parse(objectType, data));
      if (cache) {
        this.#cacheObjects(parsed);
      }
      return parsed;
    });
  }

  uploadObjects(arrayBuffers) {
    return client
      .storeInstances({ datasets: arrayBuffers })
      .then(response =>
        parser.parse(STOWResponse, JSON.parse(String(response))),
      );
  }
}

const manager = new ObjectsManager();
export default manager;
