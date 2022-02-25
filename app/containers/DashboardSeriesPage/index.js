import React, { memo, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectInstances,
  makeSelectInstancesTotalCount,
  makeSelectLoading,
  makeSelectSeries,
} from './selectors';
import { loadInstances, loadSeries, loadTotalInstancesCount } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import ObjectsTable from '../../components/ObjectsTable';
import Series, {
  FIELD_SERIES_INSTANCE_UID,
} from '../../utils/dicom/parser/series';
import Instance from '../../utils/dicom/parser/instance';
import { key } from './key';
import Study, {
  FIELD_STUDY_INSTANCE_UID,
} from '../../utils/dicom/parser/study';

export function DashboardSeriesPage({
  series,
  loading,
  errors,
  instances,
  instancesCount,
  dispatchLoadSeries,
  dispatchLoadInstances,
  dispatchLoadTotalInstancesCount,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const onInstanceClick = instanceUID => {
    console.log(instanceUID);
  };

  const { seriesId } = useParams();

  useEffect(() => {
    dispatchLoadSeries(seriesId);
  }, []);

  const loadSeriesPayload = { queryParams: {} };

  if (series) {
    loadSeriesPayload.queryParams[
      Series.getFieldAttribute(FIELD_SERIES_INSTANCE_UID)
    ] = series[FIELD_SERIES_INSTANCE_UID];
  }

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              {series && (
                <ObjectsTable
                  injectSaga={{ key, saga }}
                  objectType={Instance}
                  objects={instances}
                  objectsCount={instancesCount}
                  dispatchLoadObjects={dispatchLoadInstances}
                  dispatchLoadObjectsInitialPayload={loadSeriesPayload}
                  dispatchLoadTotalObjectsCount={
                    dispatchLoadTotalInstancesCount
                  }
                  onObjectClick={onInstanceClick}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardSeriesPage.propTypes = {
  series: PropTypes.instanceOf(Series),
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  instances: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]).isRequired,
  instancesCount: PropTypes.number.isRequired,
  dispatchLoadSeries: PropTypes.func.isRequired,
  dispatchLoadInstances: PropTypes.func.isRequired,
  dispatchLoadTotalInstancesCount: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  series: makeSelectSeries(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  instances: makeSelectInstances(),
  instancesCount: makeSelectInstancesTotalCount(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadSeries: seriesUID => dispatch(loadSeries(seriesUID)),
    dispatchLoadInstances: options => dispatch(loadInstances(options)),
    dispatchLoadTotalInstancesCount: options =>
      dispatch(loadTotalInstancesCount(options)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DashboardSeriesPage);
