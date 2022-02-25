import Study from './study';
import Series from './series';

class DicomObjectParser {
  parseStudy(data) {
    return new Study(data);
  }

  parseSeries(data) {
    return new Series(data);
  }
}

const parser = new DicomObjectParser();
export default parser;
