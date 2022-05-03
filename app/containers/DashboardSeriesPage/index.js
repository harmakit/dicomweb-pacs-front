import React, { memo, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectErrors,
  makeSelectInstances,
  makeSelectInstancesTotalCount,
  makeSelectLoading,
  makeSelectSeriesObject,
} from './selectors';
import {
  loadInstances,
  loadSeriesObject,
  loadTotalInstancesCount,
} from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import ObjectsTable from '../../components/ObjectsTable';
import Series from '../../utils/dicom/parser/series';
import Instance from '../../utils/dicom/parser/instance';
import { key } from './key';
import { routes } from '../../utils/history';
import DicomObjectInfo from '../../components/DicomObjectInfo';
import ObjectsTableOld from '../../components/ObjectsTable/old';

export function DashboardSeriesPage({
  seriesObject,
  loading,
  errors,
  instances,
  instancesCount,
  dispatchLoadSeriesObject,
  dispatchLoadInstances,
  dispatchLoadTotalInstancesCount,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const history = useHistory();
  const { seriesId, studyId } = useParams();

  const onInstanceClick = instanceUID => {
    const path = generatePath(routes.instance, {
      instanceId: instanceUID,
      studyId,
      seriesId,
    });
    history.push(path);
  };

  const wrongObjectLoaded =
    seriesObject && seriesId !== seriesObject[Series.getObjectIdField()];

  const objectFromParamsLoaded =
    seriesObject && seriesId === seriesObject[Series.getObjectIdField()];

  useEffect(() => {
    dispatchLoadSeriesObject(seriesId);
  }, [seriesId]);

  const loadInstancesPayload = { queryParams: {} };

  if (objectFromParamsLoaded) {
    loadInstancesPayload.queryParams[
      Series.getFieldAttribute(Series.getObjectIdField())
    ] = seriesObject[Series.getObjectIdField()];
  }

  if (wrongObjectLoaded) {
    return null;
  }

  return (
    <div>
      <Backdrop loading={loading}>
        {errors.map(error => (
          <ErrorAlert key={error.id} error={error} />
        ))}
        {seriesObject && <DicomObjectInfo object={seriesObject} />}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              {seriesObject && (
                <ObjectsTable
                  injectSaga={{ key, saga }}
                  objectType={Instance}
                  objects={instances}
                  objectsCount={instancesCount}
                  dispatchLoadObjects={dispatchLoadInstances}
                  dispatchLoadObjectsInitialPayload={loadInstancesPayload}
                  dispatchLoadTotalObjectsCount={
                    dispatchLoadTotalInstancesCount
                  }
                  onObjectClick={onInstanceClick}
                />
              )}
              {seriesObject && (
                <ObjectsTableOld
                  injectSaga={{ key, saga }}
                  objectType={Instance}
                  objects={instances}
                  objectsCount={instancesCount}
                  dispatchLoadObjects={dispatchLoadInstances}
                  dispatchLoadObjectsInitialPayload={loadInstancesPayload}
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
  seriesObject: PropTypes.instanceOf(Series),
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  instances: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]).isRequired,
  instancesCount: PropTypes.number.isRequired,
  dispatchLoadSeriesObject: PropTypes.func.isRequired,
  dispatchLoadInstances: PropTypes.func.isRequired,
  dispatchLoadTotalInstancesCount: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  seriesObject: makeSelectSeriesObject(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  instances: makeSelectInstances(),
  instancesCount: makeSelectInstancesTotalCount(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadSeriesObject: seriesUID =>
      dispatch(loadSeriesObject(seriesUID)),
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
