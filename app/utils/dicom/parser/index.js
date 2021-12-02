import Study from './study';

class DicomObjectParser {
  parseStudy(data) {
    return new Study(data);
  }
}

const parser = new DicomObjectParser();
export default parser;
