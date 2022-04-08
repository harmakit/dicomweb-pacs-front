import React from 'react';
import { Paper } from '@mui/material';
import PropTypes from 'prop-types';
import DicomObjectAbstract from '../../utils/dicom/parser/object';

export default function DicomObjectInfo({ object }) {
  return (
    <Paper sx={{ p: 5, m: 5 }}>
      todo: this component
      <br />
      <br />
      {JSON.stringify(object)}
    </Paper>
  );
}

DicomObjectInfo.propTypes = {
  object: PropTypes.instanceOf(DicomObjectAbstract).isRequired,
};
