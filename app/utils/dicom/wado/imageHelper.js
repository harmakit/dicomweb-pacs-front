import Instance from '../parser/instance';

class ImageHelper {
  /**
   * @param {Instance} instance
   * @return {string}
   */
  static buildImageUrl(instance) {
    const instanceId = instance[Instance.getStudyInstanceUid()];

    return `wadouri:http://localhost:8042/wado?objectUID=${instanceId}&requestType=WADO&contentType=application%2Fdicom`;
    // return `wadouri:http://localhost:8042/wado?objectUID=${instanceId}&studyUID=${studyId}&seriesUID=${seriesId}&requestType=WADO&contentType=application%2Fdicom`;
  }
}

const imageHelper = new ImageHelper();
export default imageHelper;
