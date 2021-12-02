import React, { useEffect, useState } from 'react';
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
import { noop } from 'lodash';
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
import DicomObject from '../../utils/dicom/parser/object';
import { useInjectSaga } from '../../utils/injectSaga';
import { allowedModes } from '../../utils/sagaInjectors';

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
    default:
      return [];
  }
}

function getObjectIdField(objectType) {
  switch (objectType) {
    case Study:
      return FIELD_STUDY_INSTANCE_UID;
    default:
      console.warn('Unable to identify key field! Have to use array index.');
      return null;
  }
}

function getObjectFieldAttribute(objectType, field) {
  switch (objectType) {
    case Study:
      return Study.getFieldAttribute(field);
    default:
      throw new Error('Unknown object!');
  }
}

// todo call loadObjectsTotalCount() on websocket – update objects count

export default function ObjectsTable({
  objectType,
  objects,
  objectsCount,
  onObjectClick,
  dispatchLoadObjects,
  dispatchLoadTotalObjectsCount,
  injectSaga,
}) {
  useInjectSaga(injectSaga);
  const [initialized, setInitialized] = useState(false);
  const [page, setPage] = useState(PAGINATION_DEFAULT_PAGE);
  const [rowsPerPage, setRowsPerPage] = useState(
    PAGINATION_DEFAULT_ROWS_PER_PAGE,
  );
  const rows = objects;

  useEffect(() => {
    if (!initialized) {
      loadObjects(buildPaginationData());
      loadObjectsTotalCount();
      setInitialized(true);
    }
  });

  const columns = getColumns(objectType);
  const rowKeyField = getObjectIdField(objectType);

  const buildPaginationData = (
    pageValue = page,
    rowsPerPageValue = rowsPerPage,
  ) => ({
    limit: rowsPerPageValue,
    offset: pageValue * rowsPerPageValue,
  });

  const objectsCallPayload = { queryParams: {} };

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
      includefield: getObjectFieldAttribute(objectType, rowKeyField),
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

ObjectsTable.propTypes = {
  objectType: PropTypes.func.isRequired,
  objects: PropTypes.arrayOf(PropTypes.instanceOf(DicomObject)).isRequired,
  objectsCount: PropTypes.number.isRequired,
  onObjectClick: PropTypes.func.isRequired,
  dispatchLoadObjects: PropTypes.func.isRequired,
  dispatchLoadTotalObjectsCount: PropTypes.func.isRequired,
  injectSaga: PropTypes.shape({
    key: PropTypes.string.isRequired,
    saga: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(allowedModes),
  }).isRequired,
};
