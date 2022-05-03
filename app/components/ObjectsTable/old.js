import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import PropTypes from 'prop-types';
import { merge, noop } from 'lodash';
import Study, {
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
import { useInjectSaga } from '../../utils/injectSaga';
import { allowedModes } from '../../utils/sagaInjectors';
import Series, {
  FIELD_MODALITY,
  FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
  FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
  FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
  FIELD_REQUESTED_PROCEDURE_ID,
  FIELD_SCHEDULED_PROCEDURE_STEP_ID,
  FIELD_SERIES_INSTANCE_UID,
  FIELD_SERIES_NUMBER,
} from '../../utils/dicom/parser/series';
import Instance, {
  FIELD_INSTANCE_NUMBER,
  FIELD_SOP_CLASS_UID,
  FIELD_SOP_INSTANCE_UID,
} from '../../utils/dicom/parser/instance';
import DicomObjectWithIdAbstract from '../../utils/dicom/parser/objectWithId';

export const PAGINATION_DEFAULT_PAGE = 0;
export const PAGINATION_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 100];
export const PAGINATION_DEFAULT_ROWS_PER_PAGE =
  PAGINATION_ROWS_PER_PAGE_OPTIONS[0];

function getColumns(objectType) {
  switch (objectType) {
    case Study:
      return [
        { id: FIELD_STUDY_DATE, label: 'Study Date', minWidth: '10%' },
        { id: FIELD_STUDY_TIME, label: 'Study Time', minWidth: '10%' },
        {
          id: FIELD_ACCESSION_NUMBER,
          label: 'Accession Number',
          minWidth: '10%',
        },
        { id: FIELD_MODALITIES_IN_STUDY, label: 'Modalities', minWidth: '10%' },
        {
          id: FIELD_REFERRING_PHYSICIAN_NAME,
          label: 'Physician name',
          minWidth: '10%',
        },
        { id: FIELD_PATIENT_NAME, label: 'Patient name', minWidth: '10%' },
        { id: FIELD_PATIENT_ID, label: 'Patient ID', minWidth: '10%' },
        { id: FIELD_STUDY_INSTANCE_UID, label: 'Study UID', minWidth: '15%' },
        { id: FIELD_STUDY_ID, label: 'Study ID', minWidth: '10%' },
      ];
    case Series:
      return [
        { id: FIELD_MODALITY, label: 'Modality', minWidth: '10%' },
        {
          id: FIELD_SERIES_INSTANCE_UID,
          label: 'Series Instance UID',
          minWidth: '15%',
        },
        { id: FIELD_SERIES_NUMBER, label: 'Series Number', minWidth: '10%' },
        {
          id: FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
          label: 'Performed Procedure Step Start Date',
          minWidth: '10%',
        },
        {
          id: FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
          label: 'Performed Procedure Step Start Time',
          minWidth: '10%',
        },
        {
          id: FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
          label: 'Request Attributes Sequence',
          minWidth: '10%',
        },
        {
          id: FIELD_SCHEDULED_PROCEDURE_STEP_ID,
          label: 'Scheduled Procedure Step ID',
          minWidth: '10%',
        },
        {
          id: FIELD_REQUESTED_PROCEDURE_ID,
          label: 'Requested Procedure ID',
          minWidth: '10%',
        },
      ];
    case Instance:
      return [
        { id: FIELD_SOP_CLASS_UID, label: 'SOP Class UID', minWidth: '10%' },
        {
          id: FIELD_SOP_INSTANCE_UID,
          label: 'SOP Instance UID',
          minWidth: '10%',
        },
        {
          id: FIELD_INSTANCE_NUMBER,
          label: 'Instance Number',
          minWidth: '10%',
        },
      ];
    default:
      return [];
  }
}

// todo call loadObjectsTotalCount() on websocket – update objects count

export default function ObjectsTableOld({
  objectType,
  objects,
  objectsCount,
  onObjectClick,
  dispatchLoadObjects,
  dispatchLoadObjectsInitialPayload,
  dispatchLoadTotalObjectsCount,
  injectSaga,
}) {
  useInjectSaga(injectSaga);
  const [page, setPage] = useState(PAGINATION_DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(
    PAGINATION_DEFAULT_ROWS_PER_PAGE,
  );
  const rows = objects;

  const dispatchLoadObjectsInitialPayloadHash = useMemo(
    () =>
      dispatchLoadObjectsInitialPayload
        ? JSON.stringify(dispatchLoadObjectsInitialPayload)
        : null,
    [dispatchLoadObjectsInitialPayload],
  );

  useEffect(() => {
    loadObjects(buildPaginationData());
    loadObjectsTotalCount();
  }, [dispatchLoadObjectsInitialPayloadHash]);

  const columns = getColumns(objectType);
  const rowKeyField = objectType.getObjectIdField();

  const buildPaginationData = (
    pageValue = page,
    rowsPerPageValue = rowsPerPage,
  ) => ({
    limit: rowsPerPageValue,
    offset: pageValue * rowsPerPageValue,
  });

  const objectsCallPayload = { queryParams: {} };
  if (dispatchLoadObjectsInitialPayload) {
    merge(objectsCallPayload, dispatchLoadObjectsInitialPayload);
  }

  const loadObjects = (paginationData = buildPaginationData()) => {
    const options = { ...objectsCallPayload };
    options.queryParams = {
      ...options.queryParams,
      limit: paginationData.limit,
      offset: paginationData.offset,
    };
    dispatchLoadObjects(options);
  };

  const loadObjectsTotalCount = () => {
    const options = { ...objectsCallPayload };
    options.queryParams = {
      ...options.queryParams,
      includefield: objectType.getFieldAttribute(rowKeyField),
    };
    dispatchLoadTotalObjectsCount(options);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    loadObjects(buildPaginationData(newPage, rowsPerPage));
  };

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = event.target.value;
    setRowsPerPage(newRowsPerPage);
    if (objects.length === objectsCount && newRowsPerPage >= objectsCount) {
      return;
    }
    loadObjects(buildPaginationData(page, newRowsPerPage));
  };

  return (
    <React.Fragment>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} style={{ width: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const rowKeyFieldExists = rowKeyField !== null;
              const objectID = rowKeyFieldExists ? row[rowKeyField] : index;
              const onRowClick = rowKeyFieldExists
                ? () => onObjectClick(objectID)
                : noop;
              return (
                <TableRow
                  hover={rowKeyFieldExists}
                  role="checkbox"
                  tabIndex={-1}
                  key={objectID}
                  onClick={onRowClick}
                >
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={objectsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
}

ObjectsTableOld.propTypes = {
  objectType: PropTypes.func.isRequired,
  objects: PropTypes.arrayOf(PropTypes.instanceOf(DicomObjectWithIdAbstract))
    .isRequired,
  objectsCount: PropTypes.number.isRequired,
  onObjectClick: PropTypes.func.isRequired,
  dispatchLoadObjects: PropTypes.func.isRequired,
  dispatchLoadObjectsInitialPayload: PropTypes.object,
  dispatchLoadTotalObjectsCount: PropTypes.func.isRequired,
  injectSaga: PropTypes.shape({
    key: PropTypes.string.isRequired,
    saga: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(allowedModes),
  }).isRequired,
};
