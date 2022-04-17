import DicomObjectAbstract from './object';

const FIELD_RETRIEVE_URL = 'retrieveURL';
const FIELD_FAILED_SOP_SEQUENCE = 'failedSOPSequence';
const FIELD_FAILURE_REASON = 'failureReason';
const FIELD_REFERENCED_SOP_SEQUENCE = 'referencedSOPSequence';
const FIELD_WARNING_REASON = 'warningReason';
const FIELD_ORIGINAL_ATTRIBUTES_SEQUENCE = 'originalAttributesSequence';
const FIELD_ATTRIBUTE_MODIFICATION_DATE_TIME = 'attributeModificationDateTime';
const FIELD_MODIFYING_SYSTEM = 'modifyingSystem';
const FIELD_REASON_FOR_THE_ATTRIBUTE_MODIFICATION =
  'reasonForTheAttributeModification';
const FIELD_MODIFIED_ATTRIBUTES_SEQUENCE = 'modifiedAttributesSequence';
const FIELD_OTHER_FAILURES_SEQUENCE = 'otherFailuresSequence';

class STOWResponse extends DicomObjectAbstract {
  constructor(data) {
    super(data);
    const fields = [
      FIELD_RETRIEVE_URL,
      FIELD_FAILED_SOP_SEQUENCE,
      FIELD_FAILURE_REASON,
      FIELD_REFERENCED_SOP_SEQUENCE,
      FIELD_WARNING_REASON,
      FIELD_ORIGINAL_ATTRIBUTES_SEQUENCE,
      FIELD_ATTRIBUTE_MODIFICATION_DATE_TIME,
      FIELD_MODIFYING_SYSTEM,
      FIELD_REASON_FOR_THE_ATTRIBUTE_MODIFICATION,
      FIELD_MODIFIED_ATTRIBUTES_SEQUENCE,
      FIELD_OTHER_FAILURES_SEQUENCE,
    ];
    fields.forEach(field => {
      this[field] = this.parseAttribute(
        data?.[STOWResponse.getFieldAttribute(field)],
      );
    });
  }

  static getFieldAttribute(field) {
    switch (field) {
      case FIELD_RETRIEVE_URL:
        return '00081190';
      case FIELD_FAILED_SOP_SEQUENCE:
        return '00081198';
      case FIELD_FAILURE_REASON:
        return '00081197';
      case FIELD_REFERENCED_SOP_SEQUENCE:
        return '00081199';
      case FIELD_WARNING_REASON:
        return '00081196';
      case FIELD_ORIGINAL_ATTRIBUTES_SEQUENCE:
        return '04000561';
      case FIELD_ATTRIBUTE_MODIFICATION_DATE_TIME:
        return '04000562';
      case FIELD_MODIFYING_SYSTEM:
        return '04000563';
      case FIELD_REASON_FOR_THE_ATTRIBUTE_MODIFICATION:
        return '04000565';
      case FIELD_MODIFIED_ATTRIBUTES_SEQUENCE:
        return '04000550';
      case FIELD_OTHER_FAILURES_SEQUENCE:
        return '0008119A';
      default:
        throw new Error(`[STOWResponse] Unmapped field: ${field}`);
    }
  }
}

export default STOWResponse;

export {
  FIELD_RETRIEVE_URL,
  FIELD_FAILED_SOP_SEQUENCE,
  FIELD_FAILURE_REASON,
  FIELD_REFERENCED_SOP_SEQUENCE,
  FIELD_WARNING_REASON,
  FIELD_ORIGINAL_ATTRIBUTES_SEQUENCE,
  FIELD_ATTRIBUTE_MODIFICATION_DATE_TIME,
  FIELD_MODIFYING_SYSTEM,
  FIELD_REASON_FOR_THE_ATTRIBUTE_MODIFICATION,
  FIELD_MODIFIED_ATTRIBUTES_SEQUENCE,
  FIELD_OTHER_FAILURES_SEQUENCE,
};
