import React, { memo } from 'react';
import { Grid, Paper } from '@mui/material';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import { routes } from '../../utils/history';
import messages from './messages';

const key = 'dashboardHome';

function DashboardHomePage() {
  useInjectReducer({ key, reducer });

  return (
    <Grid container spacing={2} textAlign="center">
      <Grid item container xs={12}>
        <Paper sx={{ p: 3, width: '100%' }}>
          <Link to={routes.studyList}>
            <FormattedMessage {...messages.openStudies} />
          </Link>
        </Paper>
      </Grid>
      <Grid item container xs={12}>
        <Paper sx={{ p: 3, width: '100%' }}>
          <Link to={routes.upload}>
            <FormattedMessage {...messages.openUpload} />
          </Link>
        </Paper>
      </Grid>
    </Grid>
  );
}

DashboardHomePage.propTypes = {};

const mapStateToProps = createStructuredSelector({});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardHomePage);
