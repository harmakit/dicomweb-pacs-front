import React from 'react';
import { Alert } from '@mui/material';
import PropTypes from 'prop-types';

export default function ErrorAlert({ error }) {
  if (error === false) {
    return null;
  }
  let message = false;
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof TypeError) {
    // eslint-disable-next-line prefer-destructuring
    message = error.message;
  }
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
  error: PropTypes.oneOfType([
    PropTypes.instanceOf(Error),
    PropTypes.instanceOf(TypeError),
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};
