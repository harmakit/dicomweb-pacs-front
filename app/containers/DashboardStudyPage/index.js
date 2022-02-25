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
  makeSelectLoading,
  makeSelectSeries,
  makeSelectSeriesTotalCount,
  makeSelectStudy,
} from './selectors';
import { loadSeries, loadStudy, loadTotalSeriesCount } from './actions';
import Backdrop from '../../components/Backdrop';
import ErrorAlert from '../../components/ErrorAlert';
import ObjectsTable from '../../components/ObjectsTable';
import Study, {
  FIELD_STUDY_INSTANCE_UID,
} from '../../utils/dicom/parser/study';
import Series from '../../utils/dicom/parser/series';

const key = 'dashboardSeries';

export function DashboardStudyPage({
  study,
  loading,
  errors,
  series,
  seriesCount,
  dispatchLoadStudy,
  dispatchLoadSeries,
  dispatchLoadTotalSeriesCount,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  const onSeriesClick = seriesUID => {
    console.log(seriesUID);
  };

  const { studyId } = useParams();

  useEffect(() => {
    console.log('loading study in PAGE');
    dispatchLoadStudy(studyId);
  }, []);

  const loadSeriesPayload = { queryParams: {} };

  if (study) {
    loadSeriesPayload.queryParams[
      Study.getFieldAttribute(FIELD_STUDY_INSTANCE_UID)
    ] = study[FIELD_STUDY_INSTANCE_UID];
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
              {study && (
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

DashboardStudyPage.propTypes = {
  study: PropTypes.instanceOf(Study),
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object).isRequired,
  series: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]).isRequired,
  seriesCount: PropTypes.number.isRequired,
  dispatchLoadStudy: PropTypes.func.isRequired,
  dispatchLoadSeries: PropTypes.func.isRequired,
  dispatchLoadTotalSeriesCount: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  study: makeSelectStudy(),
  series: makeSelectSeries(),
  seriesCount: makeSelectSeriesTotalCount(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatchLoadStudy: studyUID => dispatch(loadStudy(studyUID)),
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
