import React, {memo} from 'react';
// import PropTypes from 'prop-types';
import {Grid, Paper} from '@mui/material';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {compose} from 'redux';
// import { useHistory } from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useInjectReducer} from '../../utils/injectReducer';
import reducer from './reducer';
import {routes} from '../../utils/history';

const key = 'dashboardHome';

function DashboardHomePage() {
  useInjectReducer({ key, reducer });

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12}>
        <Paper sx={{ p: 3, width: '100%' }}>
          <Link to={routes.studyList}>Go to studies</Link>
        </Paper>
      </Grid>
      <Grid item container xs={12}>
        <Paper sx={{ p: 3, width: '100%' }}>
          <Link disabled to={routes.home}>
            Upload DICOM file
          </Link>
        </Paper>
      </Grid>
    </Grid>
  );
}

DashboardHomePage.propTypes = {
  // children: PropTypes.element,
};

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
