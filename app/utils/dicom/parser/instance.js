import Series from './series';

const FIELD_SOP_CLASS_UID = 'SOP Class UID';
const FIELD_SOP_INSTANCE_UID = 'SOP Instance UID';
const FIELD_INSTANCE_NUMBER = 'Instance Number';

class Instance extends Series {
  constructor(data) {
    super(data);
    const fields = [
      FIELD_SOP_CLASS_UID,
      FIELD_SOP_INSTANCE_UID,
      FIELD_INSTANCE_NUMBER,
    ];
    fields.forEach(field => {
      this[field] = this.parseAttribute(
        data?.[Instance.getFieldAttribute(field)],
      );
    });
  }

  static getObjectIdField() {
    return FIELD_SOP_INSTANCE_UID;
  }

  static getFieldAttribute(field) {
    switch (field) {
      case FIELD_SOP_CLASS_UID:
        return '00080016';
      case FIELD_SOP_INSTANCE_UID:
        return '00080018';
      case FIELD_INSTANCE_NUMBER:
        return '00200013';
      default:
        throw new Error(`[Instance] Unmapped field: ${field}`);
    }
  }
}

export default Instance;

export { FIELD_SOP_CLASS_UID, FIELD_SOP_INSTANCE_UID, FIELD_INSTANCE_NUMBER };
