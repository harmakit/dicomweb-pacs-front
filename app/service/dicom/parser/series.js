import Study from './study';
import DicomObjectWithIdAbstract from './objectWithId';

const FIELD_MODALITY = 'modality';
const FIELD_SERIES_INSTANCE_UID = 'seriesInstanceUID';
const FIELD_SERIES_NUMBER = 'seriesNumber';
const FIELD_PERFORMED_PROCEDURE_STEP_START_DATE =
  'performedProcedureStepStartDate';
const FIELD_PERFORMED_PROCEDURE_STEP_START_TIME =
  'performedProcedureStepStartTime';
const FIELD_REQUEST_ATTRIBUTES_SEQUENCE = 'requestAttributesSequence';
const FIELD_SCHEDULED_PROCEDURE_STEP_ID = 'scheduledProcedureStepId';
const FIELD_REQUESTED_PROCEDURE_ID = 'requestedProcedureId';

class Series extends DicomObjectWithIdAbstract {
  constructor(data) {
    super(data);
    const fields = [
      Study.getObjectIdField(),
      FIELD_MODALITY,
      FIELD_SERIES_INSTANCE_UID,
      FIELD_SERIES_NUMBER,
      FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
      FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
      FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
      FIELD_SCHEDULED_PROCEDURE_STEP_ID,
      FIELD_REQUESTED_PROCEDURE_ID,
    ];
    fields.forEach(field => {
      this[field] = this.parseAttribute(
        data?.[Series.getFieldAttribute(field)],
      );
    });
  }

  static getObjectIdField() {
    return FIELD_SERIES_INSTANCE_UID;
  }

  static getFieldAttribute(field) {
    switch (field) {
      case FIELD_MODALITY:
        return '00080060';
      case FIELD_SERIES_INSTANCE_UID:
        return '0020000E';
      case FIELD_SERIES_NUMBER:
        return '00200011';
      case FIELD_PERFORMED_PROCEDURE_STEP_START_DATE:
        return '00400244';
      case FIELD_PERFORMED_PROCEDURE_STEP_START_TIME:
        return '00400245';
      case FIELD_REQUEST_ATTRIBUTES_SEQUENCE:
        return '00400275';
      case FIELD_SCHEDULED_PROCEDURE_STEP_ID:
        return '00400009';
      case FIELD_REQUESTED_PROCEDURE_ID:
        return '00401001';
      case Study.getObjectIdField():
        return Study.getFieldAttribute(Study.getObjectIdField());
      default:
        throw new Error(`[Series] Unmapped field: ${field}`);
    }
  }
}

export default Series;

export {
  FIELD_MODALITY,
  FIELD_SERIES_INSTANCE_UID,
  FIELD_SERIES_NUMBER,
  FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
  FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
  FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
  FIELD_SCHEDULED_PROCEDURE_STEP_ID,
  FIELD_REQUESTED_PROCEDURE_ID,
};
