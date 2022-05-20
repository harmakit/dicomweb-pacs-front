import { defineMessages } from 'react-intl';
import {
  FIELD_ACCESSION_NUMBER,
  FIELD_MODALITIES_IN_STUDY,
  FIELD_PATIENT_ID,
  FIELD_PATIENT_NAME,
  FIELD_REFERRING_PHYSICIAN_NAME,
  FIELD_STUDY_DATE,
  FIELD_STUDY_ID,
  FIELD_STUDY_INSTANCE_UID,
  FIELD_STUDY_TIME,
} from '../../utils/dicom/parser/study';
import {
  FIELD_INSTANCE_NUMBER,
  FIELD_SOP_CLASS_UID,
  FIELD_SOP_INSTANCE_UID,
} from '../../utils/dicom/parser/instance';
import {
  FIELD_MODALITY,
  FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
  FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
  FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
  FIELD_REQUESTED_PROCEDURE_ID,
  FIELD_SCHEDULED_PROCEDURE_STEP_ID,
  FIELD_SERIES_INSTANCE_UID,
  FIELD_SERIES_NUMBER,
} from '../../utils/dicom/parser/series';

export const scope = 'app.components.ObjectsTable';

export default defineMessages({
  columns: {
    study: {
      [FIELD_STUDY_DATE]: {
        id: `dicom.objects.study.${FIELD_STUDY_DATE}`,
      },
      [FIELD_STUDY_TIME]: {
        id: `dicom.objects.study.${FIELD_STUDY_TIME}`,
      },
      [FIELD_ACCESSION_NUMBER]: {
        id: `dicom.objects.study.${FIELD_ACCESSION_NUMBER}`,
      },
      [FIELD_MODALITIES_IN_STUDY]: {
        id: `dicom.objects.study.${FIELD_MODALITIES_IN_STUDY}`,
      },
      [FIELD_REFERRING_PHYSICIAN_NAME]: {
        id: `dicom.objects.study.${FIELD_REFERRING_PHYSICIAN_NAME}`,
      },
      [FIELD_PATIENT_NAME]: {
        id: `dicom.objects.study.${FIELD_PATIENT_NAME}`,
      },
      [FIELD_PATIENT_ID]: {
        id: `dicom.objects.study.${FIELD_PATIENT_ID}`,
      },
      [FIELD_STUDY_INSTANCE_UID]: {
        id: `dicom.objects.study.${FIELD_STUDY_INSTANCE_UID}`,
      },
      [FIELD_STUDY_ID]: {
        id: `dicom.objects.study.${FIELD_STUDY_ID}`,
      },
    },
    series: {
      [FIELD_MODALITY]: {
        id: `dicom.objects.series.${FIELD_MODALITY}`,
      },
      [FIELD_SERIES_INSTANCE_UID]: {
        id: `dicom.objects.series.${FIELD_SERIES_INSTANCE_UID}`,
      },
      [FIELD_SERIES_NUMBER]: {
        id: `dicom.objects.series.${FIELD_SERIES_NUMBER}`,
      },
      [FIELD_PERFORMED_PROCEDURE_STEP_START_DATE]: {
        id: `dicom.objects.series.${FIELD_PERFORMED_PROCEDURE_STEP_START_DATE}`,
      },
      [FIELD_PERFORMED_PROCEDURE_STEP_START_TIME]: {
        id: `dicom.objects.series.${FIELD_PERFORMED_PROCEDURE_STEP_START_TIME}`,
      },
      [FIELD_REQUEST_ATTRIBUTES_SEQUENCE]: {
        id: `dicom.objects.series.${FIELD_REQUEST_ATTRIBUTES_SEQUENCE}`,
      },
      [FIELD_SCHEDULED_PROCEDURE_STEP_ID]: {
        id: `dicom.objects.series.${FIELD_SCHEDULED_PROCEDURE_STEP_ID}`,
      },
      [FIELD_REQUESTED_PROCEDURE_ID]: {
        id: `dicom.objects.series.${FIELD_REQUESTED_PROCEDURE_ID}`,
      },
    },
    instance: {
      [FIELD_SOP_CLASS_UID]: {
        id: `dicom.objects.instance.${FIELD_SOP_CLASS_UID}`,
      },
      [FIELD_SOP_INSTANCE_UID]: {
        id: `dicom.objects.instance.${FIELD_SOP_INSTANCE_UID}`,
      },
      [FIELD_INSTANCE_NUMBER]: {
        id: `dicom.objects.instance.${FIELD_INSTANCE_NUMBER}`,
      },
    },
  },
  FilterDialog: {
    filterBy: {
      id: `${scope}.FilterDialog.filterBy`,
    },
    cancel: {
      id: `${scope}.FilterDialog.cancel`,
    },
    save: {
      id: `${scope}.FilterDialog.save`,
    },
  },
});
