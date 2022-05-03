import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import { Tooltip } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
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
import './index.css';

export const PAGINATION_DEFAULT_PAGE = 0;
export const PAGINATION_ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 100];
export const PAGINATION_DEFAULT_ROWS_PER_PAGE =
  PAGINATION_ROWS_PER_PAGE_OPTIONS[0];

function getColumns(objectType, handleCopyToClipboard) {
  const fieldProperty = 'field';
  const labelProperty = 'headerName';
  const minWidthProperty = 'minWidth';
  const flexProperty = 'flex';

  const renderCellProperty = 'renderCell';
  const renderCellValue = params => (
    <Tooltip
      title={
        <span style={{ wordBreak: 'break-all' }}>
          {/* <ContentCopyIcon */}
          {/*   fontSize="small" */}
          {/*   style={{ */}
          {/*     cursor: 'pointer', */}
          {/*     marginRight: '5px', */}
          {/*   }} */}
          {/*   onClick={() => handleCopyToClipboard(params.value)} */}
          {/* /> */}
          {params.value}
        </span>
      }
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {params.value}
      </span>
    </Tooltip>
  );

  const columns = () => {
    switch (objectType) {
      case Study:
        return [
          {
            [fieldProperty]: FIELD_STUDY_DATE,
            [labelProperty]: 'Study Date',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_STUDY_TIME,
            [labelProperty]: 'Study Time',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_ACCESSION_NUMBER,
            [labelProperty]: 'Accession Number',
            [flexProperty]: 1,
            [minWidthProperty]: 140,
          },
          {
            [fieldProperty]: FIELD_MODALITIES_IN_STUDY,
            [labelProperty]: 'Modalities',
            [flexProperty]: 1,
            [minWidthProperty]: 90,
          },
          {
            [fieldProperty]: FIELD_REFERRING_PHYSICIAN_NAME,
            [labelProperty]: 'Physician name',
            [flexProperty]: 1,
            [minWidthProperty]: 120,
          },
          {
            [fieldProperty]: FIELD_PATIENT_NAME,
            [labelProperty]: 'Patient name',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_PATIENT_ID,
            [labelProperty]: 'Patient ID',
            [flexProperty]: 1,
            [minWidthProperty]: 85,
          },
          {
            [fieldProperty]: FIELD_STUDY_INSTANCE_UID,
            [labelProperty]: 'Study UID',
            [flexProperty]: 1,
            [minWidthProperty]: 85,
          },
          {
            [fieldProperty]: FIELD_STUDY_ID,
            [labelProperty]: 'Study ID',
            [flexProperty]: 1,
            [minWidthProperty]: 85,
          },
        ];
      case Series:
        return [
          {
            [fieldProperty]: FIELD_MODALITY,
            [labelProperty]: 'Modality',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_SERIES_INSTANCE_UID,
            [labelProperty]: 'Series Instance UID',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_SERIES_NUMBER,
            [labelProperty]: 'Series Number',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_PERFORMED_PROCEDURE_STEP_START_DATE,
            [labelProperty]: 'Performed Procedure Step Start Date',
            headerClassName: 'wrapHeader',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_PERFORMED_PROCEDURE_STEP_START_TIME,
            [labelProperty]: 'Performed Procedure Step Start Time',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_REQUEST_ATTRIBUTES_SEQUENCE,
            [labelProperty]: 'Request Attributes Sequence',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_SCHEDULED_PROCEDURE_STEP_ID,
            [labelProperty]: 'Scheduled Procedure Step ID',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_REQUESTED_PROCEDURE_ID,
            [labelProperty]: 'Requested Procedure ID',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
        ];
      case Instance:
        return [
          {
            [fieldProperty]: FIELD_SOP_CLASS_UID,
            [labelProperty]: 'SOP Class UID',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_SOP_INSTANCE_UID,
            [labelProperty]: 'SOP Instance UID',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
          {
            [fieldProperty]: FIELD_INSTANCE_NUMBER,
            [labelProperty]: 'Instance Number',
            [flexProperty]: 1,
            [minWidthProperty]: 100,
          },
        ];
      default:
        return [];
    }
  };

  return columns().map(column => ({
    ...column,
    [renderCellProperty]: renderCellValue,
  }));
}

// const useStyle = makeStyles({
//   root: {
//     '& .wrapHeader .MuiDataGrid-colCellTitle': {
//       overflow: 'hidden',
//       lineHeight: '20px',
//       whiteSpace: 'normal',
//     },
//   },
// });

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(
    PAGINATION_DEFAULT_ROWS_PER_PAGE,
  );

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

  const handleCopyToClipboard = value => {
    navigator.clipboard.writeText(value);
    setSnackbarOpen(true);
    setSnackbarText(`"${value}" copied!`);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarText('');
  };

  const columns = getColumns(objectType, handleCopyToClipboard);
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

  const getRows = () =>
    objects.map(object => ({
      ...object,
      id: object[rowKeyField],
    }));

  const rows = getRows();
  // const classes = useStyle();
  return (
    <React.Fragment>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        message={snackbarText}
      />
      <DataGrid
        autoHeight
        // className={classes.root}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
      {/* <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}> */}
      {/*   <Table stickyHeader aria-label="sticky table"> */}
      {/*     <TableHead> */}
      {/*       <TableRow> */}
      {/*         {columns.map(column => ( */}
      {/*           <TableCell key={column.id} style={{ width: column.minWidth }}> */}
      {/*             {column.label} */}
      {/*           </TableCell> */}
      {/*         ))} */}
      {/*       </TableRow> */}
      {/*     </TableHead> */}
      {/*     <TableBody> */}
      {/*       {rows.map((row, index) => { */}
      {/*         const rowKeyFieldExists = rowKeyField !== null; */}
      {/*         const objectID = rowKeyFieldExists ? row[rowKeyField] : index; */}
      {/*         const onRowClick = rowKeyFieldExists */}
      {/*           ? () => onObjectClick(objectID) */}
      {/*           : noop; */}
      {/*         return ( */}
      {/*           <TableRow */}
      {/*             hover={rowKeyFieldExists} */}
      {/*             role="checkbox" */}
      {/*             tabIndex={-1} */}
      {/*             key={objectID} */}
      {/*             onClick={onRowClick} */}
      {/*           > */}
      {/*             {columns.map(column => { */}
      {/*               const value = row[column.id]; */}
      {/*               return ( */}
      {/*                 <TableCell key={column.id} align={column.align}> */}
      {/*                   {column.format && typeof value === 'number' */}
      {/*                     ? column.format(value) */}
      {/*                     : value} */}
      {/*                 </TableCell> */}
      {/*               ); */}
      {/*             })} */}
      {/*           </TableRow> */}
      {/*         ); */}
      {/*       })} */}
      {/*     </TableBody> */}
      {/*   </Table> */}
      {/* </TableContainer> */}
      {/* <TablePagination */}
      {/*   rowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS} */}
      {/*   component="div" */}
      {/*   count={objectsCount} */}
      {/*   rowsPerPage={rowsPerPage} */}
      {/*   page={page} */}
      {/*   onPageChange={handleChangePage} */}
      {/*   onRowsPerPageChange={handleChangeRowsPerPage} */}
      {/* /> */}
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
