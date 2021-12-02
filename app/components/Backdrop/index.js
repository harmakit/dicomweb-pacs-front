import React from 'react';
import './style.css';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

export default function Backdrop({ loading, task, children, ...rest }) {
  return (
    <div className="c-backdrop" {...rest}>
      {loading && (
        <div>
          <div className="backdrop" />
          <div className="loading">
            <CircularProgress size={24} />
            {task && <p>{task}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

Backdrop.propTypes = {
  loading: PropTypes.bool.isRequired,
  task: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};
