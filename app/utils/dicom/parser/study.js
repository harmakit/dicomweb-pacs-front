import DicomObject from './object';

const FIELD_STUDY_DATE = 'studyDate';
const FIELD_STUDY_TIME = 'studyTime';
const FIELD_ACCESSION_NUMBER = 'accessionNumber';
const FIELD_MODALITIES_IN_STUDY = 'modalitiesInStudy';
const FIELD_REFERRING_PHYSICIAN_NAME = 'referringPhysicianName';
const FIELD_PATIENT_NAME = 'patientName';
const FIELD_PATIENT_ID = 'patientID';
const FIELD_STUDY_INSTANCE_UID = 'studyInstanceUID';
const FIELD_STUDY_ID = 'studyID';

class Study extends DicomObject {
  constructor(data) {
    super(data);
    this[FIELD_STUDY_DATE] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_STUDY_DATE)],
    );
    this[FIELD_STUDY_TIME] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_STUDY_TIME)],
    );
    this[FIELD_ACCESSION_NUMBER] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_ACCESSION_NUMBER)],
    );
    this[FIELD_MODALITIES_IN_STUDY] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_MODALITIES_IN_STUDY)],
    );
    this[FIELD_REFERRING_PHYSICIAN_NAME] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_REFERRING_PHYSICIAN_NAME)],
    );
    this[FIELD_PATIENT_NAME] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_PATIENT_NAME)],
    );
    this[FIELD_PATIENT_ID] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_PATIENT_ID)],
    );
    this[FIELD_STUDY_INSTANCE_UID] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_STUDY_INSTANCE_UID)],
    );
    this[FIELD_STUDY_ID] = this.parseAttribute(
      data?.[Study.getFieldAttribute(FIELD_STUDY_ID)],
    );
  }

  static getFieldAttribute(field) {
    switch (field) {
      case FIELD_STUDY_DATE:
        return '00080020';
      case FIELD_STUDY_TIME:
        return '00080030';
      case FIELD_ACCESSION_NUMBER:
        return '00080050';
      case FIELD_MODALITIES_IN_STUDY:
        return '00080061';
      case FIELD_REFERRING_PHYSICIAN_NAME:
        return '00080090';
      case FIELD_PATIENT_NAME:
        return '00100010';
      case FIELD_PATIENT_ID:
        return '00100020';
      case FIELD_STUDY_INSTANCE_UID:
        return '0020000D';
      case FIELD_STUDY_ID:
        return '00200010';
      default:
        throw new Error(`[Study] Unmapped field: ${field}`);
    }
  }
}

export default Study;

export {
  FIELD_STUDY_DATE,
  FIELD_STUDY_TIME,
  FIELD_ACCESSION_NUMBER,
  FIELD_MODALITIES_IN_STUDY,
  FIELD_REFERRING_PHYSICIAN_NAME,
  FIELD_PATIENT_NAME,
  FIELD_PATIENT_ID,
  FIELD_STUDY_INSTANCE_UID,
  FIELD_STUDY_ID,
};
