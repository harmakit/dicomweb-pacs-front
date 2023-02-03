import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  IconButton,
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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FormattedMessage } from 'react-intl';
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
import FilterDialog from './FilterDialog';
import messages from './messages';

export const PAGINATION_DEFAULT_PAGE = 0;
export const PAGINATION_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 100];
export const PAGINATION_DEFAULT_ROWS_PER_PAGE =
  PAGINATION_ROWS_PER_PAGE_OPTIONS[0];

function getColumns(objectType) {
  switch (objectType) {
    case Study:
      return [
        {
          id: FIELD_STUDY_DATE,
          label: (
            <FormattedMessage {...messages.columns.study[FIELD_STUDY_DATE]} />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_STUDY_TIME,
          label: (
            <FormattedMessage {...messages.columns.study[FIELD_STUDY_TIME]} />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_ACCESSION_NUMBER,
          label: (
            <FormattedMessage
              {...messages.columns.study[FIELD_ACCESSION_NUMBER]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_MODALITIES_IN_STUDY,
          label: (
            <FormattedMessage
              {...messages.columns.study[FIELD_MODALITIES_IN_STUDY]}
            />
          ),
          minWidth: '10%',
          format: value => (Array.isArray(value) ? value.join(', ') : value),
        },
        {
          id: FIELD_REFERRING_PHYSICIAN_NAME,
          label: (
            <FormattedMessage
              {...messages.columns.study[FIELD_REFERRING_PHYSICIAN_NAME]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_PATIENT_NAME,
          label: (
            <FormattedMessage {...messages.columns.study[FIELD_PATIENT_NAME]} />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_PATIENT_ID,
          label: (
            <FormattedMessage {...messages.columns.study[FIELD_PATIENT_ID]} />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_STUDY_INSTANCE_UID,
          label: (
            <FormattedMessage
              {...messages.columns.study[FIELD_STUDY_INSTANCE_UID]}
            />
          ),
          minWidth: '15%',
        },
        {
          id: FIELD_STUDY_ID,
          label: (
            <FormattedMessage {...messages.columns.study[FIELD_STUDY_ID]} />
          ),
          minWidth: '10%',
        },
      ];
    case Series:
      return [
        {
          id: FIELD_MODALITY,
          label: (
            <FormattedMessage {...messages.columns.series[FIELD_MODALITY]} />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_SERIES_INSTANCE_UID,
          label: (
            <FormattedMessage
              {...messages.columns.series[FIELD_SERIES_INSTANCE_UID]}
            />
          ),
          minWidth: '15%',
        },
        {
          id: FIELD_SERIES_NUMBER,
          label: (
            <FormattedMessage
              {...messages.columns.series[FIELD_SERIES_NUMBER]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
          label: (
            <FormattedMessage
              {...messages.columns.series[
                FIELD_PERFORMED_PROCEDURE_STEP_START_DATE
              ]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
          label: (
            <FormattedMessage
              {...messages.columns.series[
                FIELD_PERFORMED_PROCEDURE_STEP_START_TIME
              ]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
          label: (
            <FormattedMessage
              {...messages.columns.series[FIELD_REQUEST_ATTRIBUTES_SEQUENCE]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_SCHEDULED_PROCEDURE_STEP_ID,
          label: (
            <FormattedMessage
              {...messages.columns.series[FIELD_SCHEDULED_PROCEDURE_STEP_ID]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_REQUESTED_PROCEDURE_ID,
          label: (
            <FormattedMessage
              {...messages.columns.series[FIELD_REQUESTED_PROCEDURE_ID]}
            />
          ),
          minWidth: '10%',
        },
      ];
    case Instance:
      return [
        {
          id: FIELD_SOP_CLASS_UID,
          label: (
            <FormattedMessage
              {...messages.columns.instance[FIELD_SOP_CLASS_UID]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_SOP_INSTANCE_UID,
          label: (
            <FormattedMessage
              {...messages.columns.instance[FIELD_SOP_INSTANCE_UID]}
            />
          ),
          minWidth: '10%',
        },
        {
          id: FIELD_INSTANCE_NUMBER,
          label: (
            <FormattedMessage
              {...messages.columns.instance[FIELD_INSTANCE_NUMBER]}
            />
          ),
          minWidth: '10%',
        },
      ];
    default:
      return [];
  }
}

// todo call loadObjectsTotalCount() on websocket – update objects count

export default function ObjectsTable({
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
  const [filters, setFilters] = useState(new Map());
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterColumn, setFilterColumn] = useState(null);

  const rows = objects;

  const dispatchLoadObjectsInitialPayloadHash = useMemo(
    () =>
      dispatchLoadObjectsInitialPayload
        ? JSON.stringify(dispatchLoadObjectsInitialPayload)
        : null,
    [dispatchLoadObjectsInitialPayload],
  );
  const filtersHash = JSON.stringify(Array.from(filters.entries()));

  useEffect(() => {
    loadObjects(buildPaginationData());
    loadObjectsTotalCount();
  }, [dispatchLoadObjectsInitialPayloadHash, filtersHash]);

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
  filters.forEach((mapFilterColumnValue, mapFilterColumn) => {
    objectsCallPayload.queryParams[
      objectType.getFieldAttribute(mapFilterColumn)
    ] = mapFilterColumnValue;
  });
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

  const handleFilterIconClick = (event, column) => {
    setFilterColumn(column);
    setFilterOpen(true);
  };

  const setFilter = (column, filter) => {
    if (filter === '') {
      filters.delete(column.id);
    } else {
      filters.set(column.id, filter);
    }
    setFilters(filters);
  };

  const getFilter = column => filters.get(column.id);

  const filterColumnValue = filterColumn ? getFilter(filterColumn) || '' : '';

  return (
    <React.Fragment>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => {
                const isFilterActive = getFilter(column) !== undefined;
                return (
                  <TableCell key={column.id} style={{ width: column.minWidth }}>
                    <IconButton
                      size="small"
                      onClick={e => handleFilterIconClick(e, column)}
                      style={{ position: 'absolute', right: 5, top: 5 }}
                    >
                      <Badge
                        color="info"
                        badgeContent="x"
                        variant="dot"
                        invisible={!isFilterActive}
                      >
                        <FilterAltIcon
                          sx={{
                            width: '0.8em',
                            height: '0.8em',
                          }}
                          opacity={isFilterActive ? 1 : 0.4}
                        />
                      </Badge>
                    </IconButton>
                    {column.label}
                  </TableCell>
                );
              })}
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
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value) : value}
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
      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        column={filterColumn}
        onSave={filter => {
          setFilterOpen(false);
          setFilter(filterColumn, filter);
        }}
        value={filterColumnValue}
      />
    </React.Fragment>
  );
}

ObjectsTable.propTypes = {
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
