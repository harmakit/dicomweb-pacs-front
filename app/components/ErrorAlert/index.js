import React from 'react';
import { Alert } from '@mui/material';
import PropTypes from 'prop-types';
import { PackedError } from '../../utils/errors';

export default function ErrorAlert({ error }) {
  let { message } = error;
  if (!message) {
    message = 'Unknown error';
  }
  return (
    <Alert severity="error" sx={{ mt: 1, mb: 1 }}>
      {message}
    </Alert>
  );
}

ErrorAlert.propTypes = {
  error: PropTypes.instanceOf(PackedError).isRequired,
};
