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
  makeSelectLoading,
  makeSelectSeries,
  makeSelectSeriesTotalCount,
  makeSelectStudyObject,
} from './selectors';
import { loadSeries, loadStudyObject, loadTotalSeriesCount } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import ObjectsTable from '../../components/ObjectsTable';
import Study from '../../service/dicom/parser/study';
import Series from '../../service/dicom/parser/series';
import { routes } from '../../utils/history';
import { key } from './key';
import DicomObjectInfo from '../../components/DicomObjectInfo';

export function DashboardSeriesListPage({
  studyObject,
  loading,
  errors,
  series,
  seriesCount,
  dispatchLoadStudyObject,
  dispatchLoadSeries,
  dispatchLoadTotalSeriesCount,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const history = useHistory();
  const { studyId } = useParams();

  const wrongObjectLoaded =
    studyObject && studyId !== studyObject[Study.getObjectIdField()];

  const objectFromParamsLoaded =
    studyObject && studyId === studyObject[Study.getObjectIdField()];

  const onSeriesClick = seriesUID => {
    const path = generatePath(routes.instanceList, {
      studyId,
      seriesId: seriesUID,
    });
    history.push(path);
  };

  useEffect(() => {
    dispatchLoadStudyObject(studyId);
  }, [studyId]);

  const loadSeriesPayload = { queryParams: {} };

  if (objectFromParamsLoaded) {
    loadSeriesPayload[Study.getObjectIdField()] =
      studyObject[Study.getObjectIdField()];
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
        {studyObject && <DicomObjectInfo object={studyObject} />}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ mt: 2 }}>
              {studyObject && (
                <ObjectsTable
                  injectSaga={{ key, saga }}
                  objectType={Series}
                  objects={series}
                  objectsCount={seriesCount}
                  dispatchLoadObjects={dispatchLoadSeries}
                  dispatchLoadObjectsInitialPayload={loadSeriesPayload}
                  dispatchLoadTotalObjectsCount={dispatchLoadTotalSeriesCount}
                  onObjectClick={onSeriesClick}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Backdrop>
    </div>
  );
}

DashboardSeriesListPage.propTypes = {
  studyObject: PropTypes.instanceOf(Study),
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]).isRequired,
  seriesCount: PropTypes.number.isRequired,
  dispatchLoadStudyObject: PropTypes.func.isRequired,
  dispatchLoadSeries: PropTypes.func.isRequired,
  dispatchLoadTotalSeriesCount: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  studyObject: makeSelectStudyObject(),
  series: makeSelectSeries(),
  seriesCount: makeSelectSeriesTotalCount(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadStudyObject: studyUID => dispatch(loadStudyObject(studyUID)),
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
)(DashboardSeriesListPage);
