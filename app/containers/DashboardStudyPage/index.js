import React, { memo } from 'react';
import { Grid, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectLoading,
  makeSelectSeries,
  makeSelectSeriesTotalCount,
} from './selectors';
import { loadSeries, loadTotalSeriesCount } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import ObjectsTable from '../../components/ObjectsTable';
import Study from '../../utils/dicom/parser/study';

const key = 'dashboardSeries';

export function DashboardStudyPage({
  loading,
  errors,
  series,
  totalCountLoading,
  dispatchLoadSeries,
  dispatchLoadTotalSeriesCount,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const onStudyClick = studyUID => {
    console.log(studyUID);
  };

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              <ObjectsTable
                injectSaga={{ key, saga }}
                objectType={Study}
                objects={series}
                objectsCount={totalCountLoading}
                dispatchLoadObjects={dispatchLoadSeries}
                dispatchLoadTotalObjectsCount={dispatchLoadTotalSeriesCount}
                onObjectClick={onStudyClick}
              />
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardStudyPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]).isRequired,
  totalCountLoading: PropTypes.number.isRequired,
  dispatchLoadSeries: PropTypes.func.isRequired,
  dispatchLoadTotalSeriesCount: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  series: makeSelectSeries(),
  totalCountLoading: makeSelectSeriesTotalCount(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadSeries: options => dispatch(loadSeries(options)),
    dispatchLoadTotalSeriesCount: options =>
      dispatch(loadTotalSeriesCount(options)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardStudyPage);
